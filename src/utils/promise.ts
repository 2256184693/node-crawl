/* eslint-disable @typescript-eslint/no-explicit-any */

import getLogger from './log'

const logger = getLogger('[PROMISE]')

const isPromise = <T>(p): p is Promise<T> => {
    if (p && p.then) {
        return true
    }
    return false
}

export const promise = <T extends (...args: any[]) => any | Promise<any>>(func: T)  => {
    return <K extends ReturnType<T>>(...args: Parameters<T>) => {
        const p = func(...args) as K
        return new Promise<K>((resolve, reject) => {
            if (isPromise(p)) {
                p.then(res => resolve(res)).catch(e => reject(e))
            } else {
                resolve(p)
            }
        })
    }
}


class Queue {
    name: string
    concurrency: number
    buffer: number
    current: number
    queue: Array<() => Promise<any>>
    promise: Promise<any>
    resolve: (val: any) => void
    reject: () => void
    constructor({ concurrency = 1, buffer = 200, name = 'task' }) {
        this.name = name
        this.concurrency = concurrency
        this.current = 0
        this.buffer = buffer
        this.queue = []
    }

    add (task) {
        const _task = promise(task)
        this.queue.push(_task)
    }

    run () {
        if (this.queue.length === 0 || this.concurrency === this.current) return

        this.current++

        const promiseTask = this.queue.shift()

        promiseTask().then(() => this.next()).catch(() => this.next())
    }

    next () {
        this.current--

        if (this.queue.length) {
            this.run()
        } else if (this.current === 0) {
            this.end()
        }
    }

    async start () {
        logger.debug(`任务队列开始 - ${this.name}`)
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
        })

        let max = this.concurrency

        while (max > 0) {
            this.run()
            max--;
        }

        return this.promise
    }

    end() {
        logger.debug(`任务队列结束 - ${this.name}`)
        this.resolve(true)
    }
}
export const PromiseQueue = Queue