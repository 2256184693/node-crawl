
const ajax = require('../utils-old/ajax')

const cheerio = require('cheerio')

class Spider {
    constructor(url, options = {}) {
        this.url = url
        this.queue = []
        this.mergeOptions(options)
    }

    mergeOptions(options) {
        this.options = Object.assign({
            puppeteer: false,
        }, options)
    }

    add(handler = () => {}, callback = () => {}) {
        this.queue.push({
            handler,
            callback,
        })
        return this
    }

    async start() {
        return ajax({
            url: this.url,
        }).then(body => {
            const $ = cheerio.load(body, { ignoreWhitespace: true })
            return Promise.all(this.queue.map(({ handler, callback }) => {
                return new Promise(async (resolve, reject) => {
                    const res = await handler($)

                    callback(res).then(() => resolve()).catch(e => reject(e));
                })
            }))
        }).catch(e => {
            console.error(e)
        })
    }
}

module.exports = Spider