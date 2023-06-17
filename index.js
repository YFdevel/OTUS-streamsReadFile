const fs = require("fs");
const path = require("path");

const directoryName = process.argv[2];
let str = "";

const readFile = () => {
    const readStream = fs.createReadStream(directoryName, "utf8");
    readStream.on("data", (chunk) => {
        str += chunk;
    });
    readStream.on("end", () => {
        const arr = str.split(/\s/).filter(item => !(/ ,\.-\?!_-\u2013|\u2014/).test(item)).sort();
        const obj = {};
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].replace(/[\.,_]/g, '');
            let currentElemCount = obj[arr[i]];
            let count = currentElemCount ? currentElemCount : 0;
            obj[arr[i]] = count + 1;
        }

        console.log(obj);
        const data = Object.values(obj);
        console.log(data);
        writeFile(data.join());

    });
    readStream.on("error", (error) => {
        console.log("Error: ", error);
    });
};

readFile();
const writeFile = (data) => {
    const writeStream = fs.createWriteStream(path.join(__dirname, "writing-file.txt"), "utf8");
    writeStream.write(data);
    writeStream.end(() => console.log('File writing finished'));
};

