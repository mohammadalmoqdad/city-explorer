"use strict";
//Aplication Depenencies (require)
const express = require('express');
const cors = require('cors');
require('dotenv').config();


//application setup (port,server,use cors)
const PORT = process.env.PORT || 3000;
const server = express();
server.use(cors());

//Application Routes
server.get('/location', locationHandlerFunc);
server.get('/weather', weathHanadlerFun);
server.get('*',allRoutes);


 function locationHandlerFunc(req, res){
    const locationData = require('./data/location.json');
    console.log(locationData);
    const locationObj = new Location('Lynnwood', locationData);
    res.send(locationObj);
}



function Location(city, locData) {
    this.search_query = city;
    this.formatted_query = locData[0].display_name;
    this.latitude = locData[0].lat;
    this.longitude = locData[0].lon;
}






// server.get('/', (req, res) => {
//     res.send(weather);
// })





// Weather.all = [];
function Weather(day) {
    this.forecast = day.weather.description;
    this.time = day.time;
    // Weather.all.push(this);
}





function weathHanadlerFun(req, res){
    let weather = require('./data/weather.json');
    let WeatherArr= weather.data.map(val =>{
        return new Weather(val)
    });
    res.send(WeatherArr);
}






//handle all routes
function allRoutes (req, res) {
    res.status(404).send('not found')
}




server.use((error, req, res) => {
    res.status(500).send(error);
})





server.listen(PORT, () => {
    console.log("Everything is good");
})