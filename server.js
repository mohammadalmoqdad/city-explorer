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
function Weather(){


}




server.listen(PORT,()=>{
    console.log("Everything is good");
})