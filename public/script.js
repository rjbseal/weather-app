// gather ui elements
const citySpan = document.getElementById('city');
const countrySpan = document.getElementById('country');
const iconSpan = document.getElementById('icon')
const tempSpan = document.getElementById('temp');
const weatherSpan = document.getElementById('weather');
const btnSaveEntry = document.getElementById('btn-saveEntry')


// global var to store current weather data from openweather api
let allWeatherData;


// ==========   STEP 1   ========= //
// as soon as index.html loads, run f() to get users location
window.addEventListener('DOMContentLoaded', getLocation)

// ==========   STEP 2   ========= //
function getLocation() {
    // if user has geolocation api enabled, get their current location
    if('geolocation' in navigator) {

       navigator.geolocation.getCurrentPosition(position => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const latlon = { lat, lon };

        // pass users latitude and longitude to this function (step 3)
        getWeatherData(latlon);


       })

    } else {
        return
    }
}

// ==========   STEP 3   ========= //
// pass the users location data to our server
// see 'index.js' for step 4
async function getWeatherData(currentPosition) {

    const response = await fetch('/weather', {

        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(currentPosition)
    })

    // ==========   STEP 5   ========= //
    // store the weather data returned from the api/server in 'data' var
    const data = await response.json();
    // also store weather data in the global var 'allWeatherData'
    allWeatherData = data;
    console.log(data);
    displayWeatherData(allWeatherData)
}

// this function renders the current weather info to the page
function displayWeatherData(weatherData) {
    
    const { name, sys, main, weather } = weatherData.weatherData;
    citySpan.textContent = name;
    countrySpan.textContent = sys.country;
    tempSpan.textContent = main.temp;
    weatherSpan.textContent = weather[0].description;
    
    // get weather icon
    const icon_id = weather[0].icon;
    iconSpan.setAttribute('src', `http://openweathermap.org/img/wn/${icon_id}@2x.png`);
    
    
    console.log(weatherData);
}

// when the user clicks this btn, it will save weather data to our local database
btnSaveEntry.addEventListener('click', saveWeatherData)

// function to save desired weather data to our local database
async function saveWeatherData() {

    // declare all vars we want to store weather data for
    const dateRecorded = new Date();
    const country = allWeatherData.sys.country; // country weather was recorded at
    const town = allWeatherData.name; // town weather was recorded at
    const lat = allWeatherData.coord.lat; // latitude weather was recorded at
    const lon = allWeatherData.coord.lon; // longitude weather was recorded at
    const temp = allWeatherData.main.temp; // temperature (F) weather was recorded at
    const humidity = allWeatherData.main.humidity; // humidity 
    const weather = allWeatherData.weather[0].main; // the type of weather (eg. 'cloudy', 'rainy', etc)
    const weatherDescription = allWeatherData.weather[0].description; // (expanded description - eg. 'Broken clouds', 'radioactive fallout', etc)
    const wind = allWeatherData.wind.deg; // wind direction (deg)
    const windSpeed = allWeatherData.wind.speed; // speed of wind (kph)

    // put all data in a nice little box for transport
    const weatherData = { country, town, lat, lon, temp, humidity, weather, weatherDescription, wind, windSpeed, dateRecorded }
    
    // send our weather data to server for processing
    const response = await fetch('/save', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(weatherData)
    })

    const dataToSave = await response.json();
    // provide feedback as to what data was saved to the db
    console.log(dataToSave);
}