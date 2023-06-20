const fs = require("fs");
const path = require("path");

const directoryName = process.argv[2];
let arr = [];
const obj = {};
let counter=0;

const readFile = async() => {
    const readStream = fs.createReadStream(directoryName, "utf8");
    await readStream.on("data", (chunk) => {
        const elem = chunk.split(/\s/).filter(item => !(/[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-\u2013|\u2014]+/).test(item)).sort();
        for(let item of elem){
            arr.push(item);
        }
    });
    await readStream.on("end", async() => {
         await handler();
         const data = Object.values(obj);
         await writeFile(data.join());
         clearInterval(interval);
          console.log(obj);

    });
    await readStream.on("error", (error) => {
        console.log("Error: ", error);
    });
};


const writeFile = async(data) => {
    const writeStream = fs.createWriteStream(path.join(__dirname, "writing-file.txt"), "utf8");
    await writeStream.write(data);
    await writeStream.end(() => console.log(`File writing finished. It takes ${counter} seconds to read and write the file completely`));
};

function handler() {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].replace(/[\.\,_'()":;]/g, '');
        let currentElemCount = obj[arr[i]];
        let count = currentElemCount ? currentElemCount : 0;
        obj[arr[i]] = count + 1;
    }
}

readFile().catch();
const interval=setInterval(()=>{
    console.log(++counter);
},1000);



