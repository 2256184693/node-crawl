const argv = process.argv.slice(2)

const log = !!argv.find(_ => _ === '--log')

const date = !!argv.find(_ => _ === '--date')

const success = !!argv.find(_ => _ === '--success')

const info = !!argv.find(_ => _ === '--info')

const warning = !!argv.find(_ => _ === '--warning')

const error = !!argv.find(_ => _ === '--error')

let logLevel = -1

if (success) {
    logLevel = 0
} else if (info) {
    logLevel = 1
} else if (warning) {
    logLevel = 2
} else if (error) {
    logLevel = 3
}

export default {
    log,
    date,
    info,
    warning,
    error,
    logLevel,
}