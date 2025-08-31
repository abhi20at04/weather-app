process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const query = req.body.cityname; // must match <input name="cityname"> in index.html
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=76393648f9b72ce655604c4e889344ab&units=metric";

  https.get(url, function (response) {
    console.log("Status Code:", response.statusCode);

    let data = "";
    response.on("data", function (chunk) {
      data += chunk;
    });

    response.on("end", function () {
      const weatherData = JSON.parse(data);
      const temperature = weatherData.main.temp;
      const description = weatherData.weather[0].description;

      console.log(temperature);
      console.log(description);

      res.write(`<h1>The temperature in ${query} is ${temperature}°C</h1>`);
      res.write(`<p>The weather is like ${description}</p>`);
      res.send();
    });
  });
});

app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
