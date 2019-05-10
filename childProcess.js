const spawn = require('child_process').spawn;

function executeCommand(command, additParams) {
const ls = spawn(command, additParams)

    ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
    })

    ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`)
    })

    ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
    })
}

module.exports = {
    executeCommand
}