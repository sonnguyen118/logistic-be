const fs = require('fs');

const log = {}

log.writeLog = (msg) => {
    try {
        const now = new Date();
        fs.appendFileSync('log.txt', `${now.toString()}\n${msg}`);
    } catch (error) {
        console.log(error.message)
    }

}

log.writeErrorLog = (msg) => {
    try {
        const now = new Date();
        fs.appendFileSync('log.txt', `ERROR: ${now.toString()} - ${msg}`);
        fs.appendFileSync('______________________________________ \n');
    } catch (error) {
    }

}

log.writeRequest = (req) => {
    try {
        const now = new Date();
        let msg = `\n_____________________________________________________________________________________ \n 
        ${now.toString()}\n
        API: ${req.url} \n params: ${JSON.stringify(req.params)} \n body: ${JSON.stringify(req.body)}
        `
        fs.appendFileSync('log.txt', msg);
        console.log(JSON.stringify(req.params))
    } catch (error) {
    }



}
module.exports = log;