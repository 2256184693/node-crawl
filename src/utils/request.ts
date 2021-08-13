import got, { ExtendOptions } from 'got'

import { USER_AGENT, REFERER } from './const'

const DEFAULT_OPTIONS: ExtendOptions = {
    method: 'GET',
    headers: {
        'User-Agent': USER_AGENT,
        'Referer': REFERER,
    },
    timeout: 5000
}

const request = got.extend(DEFAULT_OPTIONS)

export default request