const excute = (list, { async } = { async: false }) => cb => {
    const l = list.length;
    let index = 0;
    const asyncRun = (idx) => {
        return new Promise((resolve, reject) => {
            const cur = list[idx]
            return cb(cur, idx).then(resolve)
        }).then(_list => {
            index++
            if(index < l) {
                return asyncRun(index)
            } else {
                return Promise.resolve();
            }
        })
    }

    const run = () => {
        return Promise.all(list.map((item, i) => cb(item, i)))
    }
    if (async) {
        return asyncRun(index)
    } else {
        return run()
    }
}

module.exports = excute