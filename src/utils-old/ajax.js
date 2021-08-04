const request = require('request')

const fs = require('fs')

const path = require('path')

const ajax = options => {
    const opts = Object.assign({}, {
        url: '',
        method: 'GET',
        encoding: null,
        header: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36',
            'Referer': 'https://www.baidu.com',
        },
    }, options)

    if (!opts.url) {
        throw new Error('请求的URL不存在')
    }

    const promise = new Promise((resolve, reject) => {
        // console.log(`请求URL ===> ${opts.url}`)
        request(opts, (err, response, body) => {
            if (err) reject(err)
            
            if (response && response.statusCode === 200) {
                resolve(body)
            } else {
                reject(`${opts.url} 请求失败!`)
            }
        })
    })

    return promise
}

module.exports = ajax