import * as fs from 'fs'

import { promise } from './promise'

import getLogger from './log'

const logger = getLogger('[FS]')

export type CreateFile = (pathname: string, data: string | Uint8Array, options?: fs.WriteFileOptions) => string

export const createFile = promise<CreateFile>((pathname, data, options)=> {
    try {
        fs.appendFileSync(pathname, data, options)

        logger.info(`文件创建成功 - ${pathname}`)

        return pathname
    } catch (e) {
        logger.error(`文件创建失败 - ${pathname}\n${e}`)
    }
})

export type RewriteFile = (pathname: string, data: string | Uint8Array, options?: fs.WriteFileOptions) => string

export const rewriteFile = promise<RewriteFile>((pathname, data, options) => {
    if(fs.existsSync(pathname)) {
        fs.unlinkSync(pathname)
    }

    try {
        fs.appendFileSync(pathname, data, options)

        logger.info(`文件更新成功 - ${pathname}`)

        return pathname
    } catch (e) {
        logger.error(`文件更新失败 - ${pathname} - ${e}`)
    }
})

export type CreateDir = (pathname: string, options?: fs.MakeDirectoryOptions & fs.Mode) => string

export const createDir = promise<CreateDir>((pathname, options) => {
    if (fs.existsSync(pathname)) {
        logger.warn(`目录已存在 - ${pathname}`)
        return pathname
    }

    try {
        fs.mkdirSync(pathname, options);

        logger.info(`目录创建成功 - ${pathname}`)

        return pathname
    } catch (e) {
        logger.error(`目录创建失败 - ${Object.prototype.toString.call(pathname)} ${pathname}\n${e}`)
    }
})

export type ReadFile = <T>(
    pathname: string,
    options?: {
        encoding: BufferEncoding;
        flag?: string | undefined;
    } | BufferEncoding
) => T

export const readFile = promise<ReadFile>((pathname, options) => {
    if(!fs.existsSync(pathname)) {
        logger.error(`文件不存在 - ${pathname}`)
        return
    }

    try {
        const data = fs.readFileSync(pathname, options);

        logger.info(`文件读取成功 - ${pathname}`)

        const parseData = JSON.parse(data)

        return parseData;
    } catch (e) {
        logger.error(`文件读取失败 - ${pathname}\n${e}`)
    }
})