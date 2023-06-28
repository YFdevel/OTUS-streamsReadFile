const fs = require("fs");
const path = require("path");
const {Transform} = require('stream');

const directoryName = process.argv[2];

const readStream = fs.createReadStream(directoryName, "utf8");
const writeStream = fs.createWriteStream(path.join(__dirname, "writing-file.txt"), "utf8");
const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        let words = chunk.toString("utf8").split(/\s/);
        let transformedChunk = words.filter(item => !(/[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-\u2013|\u2014]+/).test(item)).sort();
        const data = handler(transformedChunk);
        callback(null, data);
    }
});

function handler(arr) {
    const obj = {};
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].replace(/[\.\,_'()":;]/g, '');
        let currentElemCount = obj[arr[i]];
        let count = currentElemCount ? currentElemCount : 0;
        obj[arr[i]] = count + 1;
    }
    return Object.values(obj).join();
}

readStream.pipe(transformStream).pipe(writeStream);

