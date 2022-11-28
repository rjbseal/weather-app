const express = require('express');
const fetch = require('node-fetch');
const app = express();
const api_key = '0c67ecdb16b7401dd5ed75dda78c4ca5';
const Datastore = require('nedb');

app.use(express.static('public'));
// so we can parse incoming JSON data
app.use(express.json());

// local database setup
const db = new Datastore({ filename: 'weather.db'});
// load the 'weather.db' database. If it !exists, create it
db.loadDatabase();

// ==========   STEP 4   ========= //
// send users lat + lon to the 'openweather' api
// 'openweather' will then send back current weather for that location
app.post('/weather', async (req, res) => {

    const data = req.body;
    const lat = data.lat;
    const lon = data.lon;

    // this is the endpoint where we request weather data
    // for security reasons, this is called from within our server
    const weather_response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`);

    const airqual_response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`);

    // returned weather data from 'openweather'
    const weatherData = await weather_response.json();
    const airQualData = await airqual_response.json();

    const allWeatherData = { weatherData, airQualData}

    // send weather data back to the client
    res.json(allWeatherData)
})


// the endpoint for the 'saveWeatherData()'
app.post('/save', (req, res) => {

    const data = req.body;
    console.log(data);

    db.insert(data, (err, newDoc) => {
        if(err) {
            console.log(err);
        } else {
            console.log(newDoc);
        }
    })

    // send back the data that was just saved to the client
    res.json(data)

})


// https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid={API key}

app.listen('3000', console.log('Port 3000 activated. Standby...'));