import type { CheerioAPI } from "cheerio"

import { Page } from "puppeteer"

export type RequestHtmlCallbackParams = {
    $: CheerioAPI
    body: string
}

export type LoadHtmlCallbackParams = {
    page: Page
}

export type DownloadImageOptions = {
    dir: string
    name: string
}