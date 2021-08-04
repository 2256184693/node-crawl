const ajax = require('./ajax')

const path = require('path')

const fs = require('fs')

const imgAjax = (url, { path: pathName }) => {
    return new Promise((resolve, reject) => {
        const download = () => {
            ajax({ url, timeout: 5000, }).then(body => {
                let currentPath = pathName;
    
                if (!currentPath) {
                    const ts = Date.now();
    
                    const type = path.extname(url)
    
                    const fileName = ts + type
    
                    currentPath = path.join(__dirname, '../../img/', fileName)
                }
    
                if (!fs.existsSync(currentPath)) {
                    fs.writeFileSync(currentPath, body, { encoding: 'binary' })
                    // console.log(`保存成功 ===> ${currentPath}`)
                } else {
                    // console.log(`图片已存在 ===> ${currentPath}`)
                }
                resolve(currentPath)
            }).catch((err) => {
                // console.log(`imgAjax Catch Error`, err)
                download()
            })
        }
        download()
    })
}

module.exports = imgAjax