"use strict";
//Aplication Depenencies (require)
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');
let pg = require('pg');
const e = require('express');
const client = new pg.Client(process.env.DATABASE_URL);
// const axios =require('axios');
// const yelp = require('yelp-fusion');

//application setup (port,server,use cors)
const PORT = process.env.PORT || 3000;
const server = express();
server.use(cors());



//Application Routes
server.get('/location', locationHandlerFunc)
server.get('/weather', weathHanadlerFun);
server.get('/movies', moviesHandler);
server.get('/yelp', yelpHandlerFun);
server.use(errorHandler);


server.get('*', allRoutes);//add before it 3shaaaan Allah!








function Location(city, locData) {
    this.search_query = city;
    this.formatted_query = locData[0].display_name;
    this.latitude = locData[0].lat;
    this.longitude = locData[0].lon;
}



function Weather(day) {
    this.forecast = day.weather.description;
    this.time = day.datetime;
}

function Yelp(yelpObj) {
    this.name = yelpObj.name;
    this.image_url = yelpObj.image_url;
    this.price = yelpObj.price;
    this.rating = yelpObj.rating;
    this.url = yelpObj.url;
}


  


Movie.all = [];
function Movie(MovieData) {
    this.title = MovieData.title;
    this.overview = MovieData.overview;
    this.average_votes = MovieData.vote_average;
    this.total_votes = MovieData.vote_count;
    this.image_url = `https://image.tmdb.org/t/p/w500/${MovieData.poster_path}`;
    this.popularity = MovieData.popularity;
    this.released_on = MovieData.release_date; //it is a data !
    Movie.all.push(this);
}




function locationHandlerFunc(req, res) {

    let cityName = req.query.city;
    let selectuery = `SELECT * FROM locations WHERE search_query='${cityName}';`;
    client.query(selectuery)
        .then(result => {

            if (result.rowCount) {
                res.json(result.rows[0]);
            }

            else {
                getCityLocation(cityName)
                    .then(locaData => { //return data from location IQ
                        res.status(200).json(locaData);
                    })
            }

        })
}

function getCityLocation(cityName) {

    let GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
    let url = `https://eu1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${cityName}&format=json`;
    return superagent.get(url)//bring me the data from url
        .then(myData => {
            // save to the DB
            let formatted_query = myData.body[0].display_name;
            let longitude = myData.body[0].lon;
            let latitude = myData.body[0].lat;
            let insertLocation = `INSERT INTO locations (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4)`;
            let safeValues = [cityName, formatted_query, latitude, longitude];
            return client.query(insertLocation, safeValues)
                .then(() => {
                    // res.send('your data has been added successfully!!');
                    // console.log(myData.body)
                    let locObj = new Location(cityName, myData.body);//------ just the impotrtant data-------
                    return locObj//to the client
                })
        })


}






function weathHanadlerFun(req, res) {

    let cityName = req.query.search_query;
    let lon = req.query.longitude;
    let lat = req.query.latitude;
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




function moviesHandler(req, res) {

    let cityName = req.query.search_query;
    getMovies(cityName)
        .then(data => {
            // console.log(data)
            res.status(200).json(data);
        })
        .catch(() => {
            errorHandler('Soperagnet in get movieeeeees faced a truble');
        });
}

function getMovies(cityName) {
    let MOVIE_API_KEY = process.env.MOVIE_API_KEY;
    let movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${cityName}`;
    return superagent.get(movieURL)
        .then(movieData => {
            let movieArray = movieData.body.results.map(element => new Movie(element));
            return movieArray;
        })


}

function yelpHandlerFun(req,res){
    let cityName = req.query.search_query;
    let numPage = req.query.page;
    let start = ((numPage - 1) * 5 + 1);
    let YELP_API_KEY = process.env.YELP_API_KEY;
    let yelpURL = `https://api.yelp.com/v3/businesses/search?location=${cityName}&limit=5&offset=${start}`;
    superagent.get(yelpURL)
        .set({ 'Authorization': 'Bearer ' + YELP_API_KEY })
        .then(yelpData => {
          console.log(1111111111111111111111111111111111111111111111111);
            let yData = yelpData.body.businesses.map(obj => {
                return new Yelp(obj);
            })
            res.json(yData);
        })
        .catch("error in yelp", req, res);

}








function errorHandler(error,req, res) {
    res.status(500).send(error);
}

function allRoutes(req, res) {
    res.status(404).send('not found')
}

client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`listining on port ${PORT}`);
        });
    });
