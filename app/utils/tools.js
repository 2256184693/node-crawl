const path = require('path')

const getIndex = str => {
    const { name } = path.parse(str)
    const index = name.split('-').pop()
    return index || 0
}

// 1-1.jpg 1-2.jpg
const sortByIndex = list => list.sort((a, b) => {
    const aIndex = getIndex(a)

    const bIndex = getIndex(b)

    return aIndex - bIndex
})

module.exports = {
    sortByIndex
}