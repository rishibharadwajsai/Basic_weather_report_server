const http = require("http");
const fs = require('fs');
var requests = require('requests');

const indexFile = fs.readFileSync("index.html", "utf-8");
const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Pune&units=metric&appid=b0a2d8b676334ebcbff72f86c03cfa5e")
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                const rtData = arrData.map((val) => replaceVal(indexFile, val)).join("");
                res.write(rtData);
            })
            .on('end', (err) => {
                if (err) return console.log("Connection lost due to erros", err);
                res.end();
            })
    }
    else {
        res.end("File not found");
    }
});

server.listen(8000, "127.0.0.1");