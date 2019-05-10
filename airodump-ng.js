const path = require('path')
const fs = require('fs')

const readTxtFile = () => fs.readFileSync(path.join(__dirname, 'tmp/test-01.csv'), { encoding: 'utf8' })

const readJsonFile = () => fs.readFileSync(path.join(__dirname, 'tmp/wpastream.json'), { encoding: 'utf8' })

const saveAirodumpToFile = data => {
    fs.writeFile("./tmp/wpastream.txt", data, function (err) {
        if (err) {
            return console.log(err);
        }
    })
}

const convertWpastream = () => {
    const json = JSON.stringify(readTxtFile())
    const cleanData = json.substring(0, json.indexOf('Station MAC')).split("\\n")
    const dataArray = cleanData.map(item => item.split(','))
    const description = ["BSSID", "Last", "First", "channel", "speed", "privacy", "cipher", "auth", "power", "beacons", "iv", "lan_ip", "id_length", "ESSID", "key"]

    const formattedData = dataArray.map(item => {
        let obj = {}
        item.map((item, index) => {
            item = item.trim().replace('"', '')
            obj[description[index]] = item
        })
        return obj
    })

    const myData = JSON.stringify(formattedData);
    fs.writeFile("./tmp/wpastream.json", myData, function (err) {
        if (err) {
            return console.log(err);
        }
    })
}

const getEssids = () => {
    const output = JSON.parse(readJsonFile()).map(item => item.ESSID)
    output.splice(output.length - 2)
    output.shift()
    return output
}

const getSelectedNetwork = bssid => JSON.parse(readJsonFile()).filter(item => item.ESSID === bssid)

module.exports = {
    getEssids,
    getSelectedNetwork,
    convertWpastream
}
