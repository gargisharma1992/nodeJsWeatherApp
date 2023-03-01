const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceValue = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=ottawa&appid=89acd526a5b094b164d2abfe7c997755"
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrayData = [objdata];

        const realApiData = arrayData
          .map((val) => replaceValue(homeFile, val))
          .join("");
        res.write(realApiData);
      })
      .on("end", (err) => {
        if (err) return console.log("Connection closed due to errors", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

server.listen(3001, "127.0.0.1");
