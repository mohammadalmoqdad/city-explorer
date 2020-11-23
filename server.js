"use strict";

const express= require('express');
require('dotenv').config();
const cors= require('cors');

const server =express();
server.use(cors());

const PORT=process.env.PORT|| 3000;



server.get('/location', (req, res) => {
    const locationData = require('./data/location.json');
    console.log(locationData);
    const locationObj = new Location('Lynnwood', locationData);
    res.send(locationObj);//return
});

function Location(city, locData) {
    this.search_query = city;
    this.formatted_query = locData[0].display_name;
    this.latitude = locData[0].lat;
    this.longitude = locData[0].lon;
}



let weather =require('./data/weather.json');
server.get('/',(req,res)=>{
    res.send(weather);
})


Weather.all=[];
function Weather(descreption,time){
    this.forecast =descreption;
    this.time =time;
    Weather.all.push(this);
}


server.get('/weather',(req,res)=>{
    for(let i=0;i<weather.data.length;i++){
        let descreption=weather.data[i].weather.description;
        let time=weather.data[i].datetime;
        console.log(time);
      
        let whetherObj=new Weather(descreption,time);
        
    }
    // console.log(Weather.all);
    res.send(Weather.all);
    // const copyWeather = [...weather.all];
    // weather.all=[];
    // res.send(json(copyWeather));


})
// for(let i=0;i<weather.data.length;i++){
//     let descreption=weather.data[i].weather.description;
//     let time=weather.data[i].datetime;
//     console.log(time);
  
//     let whetherObj=new Weather(descreption,time);
    
// }
// const copyWeather = [...weather.all];
// weather.all=[];
// res.send(json(copyWeather));
// res.send(JSON.stringify(Weather.all));

server.get('*', (req, res) => {
    res.status(404).send('not found')
})



server.use((error, req, res) => {
    res.status(500).send(error);
})




server.listen(PORT,()=>{
    console.log("Everything is good");
})