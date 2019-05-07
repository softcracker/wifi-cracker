const ifconfig = require('wireless-tools/ifconfig');
const fs = require('fs');
const path = require('path');

const saveNetworks = networks => {
    const myData = JSON.stringify(networks);
    fs.writeFile("./tmp/networks.json", myData, function (err) {
        if (err) {
            return console.log(err);
        }
    });

    networks.map((item, index) => {
        console.log(index + 1 + '. ' + item.interface.replace(':', ''))
    })
}

const prompt = (question, callback) => {
    var stdin = process.stdin,
        stdout = process.stdout;

    stdin.resume();
    stdout.write(question);

    stdin.once('data', function (data) {
        callback(data.toString().trim());
    });
}

const readFile = () => {
    return fs.readFileSync(path.join(__dirname, 'tmp/networks.json'), { encoding: 'utf8' });
}

const scanNetwork = networkNumber => {
    const networks = readFile()
    const selected = JSON.parse(networks.toString())[networkNumber - 1].interface.replace(':', '')
    console.log('\r\nYou have choosen: ' + selected)
}

new Promise((resolve, reject) => {
    prompt('Start scan (y: yes, n: no)? ', input => {
        if (input === 'y') {
            console.log('\r\nAvailable networks:\r\n')
            ifconfig.status((err, status) => {
                saveNetworks(status)
                resolve();
            });
        } else {
            process.exit()
        }
    })
}).then(() => {
    prompt('\r\nChoose the number of your network:\r\n', input => {
        const res = input.replace('.', '')
        scanNetwork(res)
    })
})