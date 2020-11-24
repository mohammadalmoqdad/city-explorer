"use strict";
//Aplication Depenencies (require)
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');

//application setup (port,server,use cors)
const PORT = process.env.PORT || 3000;
const server = express();
server.use(cors());

//Application Routes
server.get('/location', locationHandlerFunc)
server.get('/weather', weathHanadlerFun);
server.get('*', allRoutes);
server.use(errorHandler);

function locationHandlerFunc(req, res) {
    // const locationData = require('./data/location.json');
    // console.log(locationData);
    let cityName = req.query.city;
    // console.log(req.query);
    getCityLocation(cityName)
        .then(locData => {

            res.status(200).json(locData);
        })
}
//----I put the location handler in a function because I want to get the returned data from it (superagent)
//--and i put the superagent itself in a return beacause the return inseooide is refered to it but the one before it is refered to the function itself.
//--------- I need the return whenever what I want to put inside needs more time to be returned 
function getCityLocation(req, res, cityName) {
    let GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
    let url = `https://eu1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${cityName}&format=json`;


    return superagent.get(url)//bring me the data from url
        .then(myData => {
            let locObj = new Location(cityName, myData.body);//------ just the impotrtant data-------
            return locObj//to the client
        })
        .catch(() => {
            errorHandler('Something went wrong', req, res);
        });

}

// put the name of GEOCODE_API_KEY IN THE heruko;

function Location(city, locData) {
    this.search_query = city;
    this.formatted_query = locData[0].display_name;
    this.latitude = locData[0].lat;
    this.longitude = locData[0].lon;
}


// Weather.all = [];
function Weather(day) {
    this.forecast = day.weather.description;
    this.time = day.time;
    // Weather.all.push(this);
}


function weathHanadlerFun(req, res) {
    let cityName = req.query.search_query;
    console.log(cityName);
    let lat = req.query.latitude;
    let lon = req.query.longitude;
    let MY_WEATHER_API_KEY = process.env.MY_WEATHER_API_KEY;
    let weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&lat=${lat}&lon=${lon}&key=${MY_WEATHER_API_KEY}&days=5`;

    superagent.get(weatherURL)
        .then(weatherData => {
            let weatherArray = weatherData.body.data.map(element => new Weather(element));
            res.json(weatherArray);
        })

        .catch(() => {
            errorHandler('Soperagnet faced a truble', req, res);
        });

}




//handle all routes
function allRoutes(req, res) {
    res.status(404).send('not found')
}




function errorHandler(req, res) {
    res.status(500).send(error);
}





server.listen(PORT, () => {
    console.log("Everything is good");
})