const util = require('util');
const exec = util.promisify(require('child_process').exec);
const arr = [];

const getPass = async () => {
    const { stdout } = await exec('netsh wlan show profiles');
    const job = stdout.split(/\n+/g);
    let c = 0;
    for (let x of job) {
        c++;
        if (c <= 9) continue;
        if (c === job.length - 1) break;
        x = x.trim().split(':').join(' ').replace(/All User Profile/i, '').trim();
        if (x.match(/[a-zA-Z]/g)) {
            const getPass = (await exec(`netsh wlan show profile "${x}" key=clear`)).stdout.split(/\n+/g);
            for (let a of getPass) {
                a = a.trim();
                if (a.includes('Conten')) {
                    a = a.split(': ').slice(1).join(' ');
                    arr.push(new Password(x, a));
                }
            }
        }
    }
    return console.table(arr);
}

const Password = (ssid, password) => {
    this.ssid = ssid;
    this.password = password;
}

module.exports = getPass;