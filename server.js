"use strict";

const express= require('express');
require('dotenv').config();
const cors= require('cors');

const server =express();
server.use(cors());

const PORT=process.env.PORT|| 3000;
let weather =require('./data/weather.json');
server.get('/',(req,res)=>{
    res.send(weather);
})

server.get('/location',(req,res)=>{
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
    console.log(Weather.all);
    res.send(Weather.all);


})




server.listen(PORT,()=>{
    console.log("Everything is good");
})