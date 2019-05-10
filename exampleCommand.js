const child_process = require('child_process')

const exampleCommand = module.exports = {
    exec: child_process.exec,
    status: status
}

const parse_status = callback => {
    return function (error, stdout, stderr) {
        if (error) callback(error)
        else callback(error,
            stdout.split('\n').filter(i => i))
    }
}

function status(interface, callback) {
    return this.exec(arguments[1], parse_status(interface))
}