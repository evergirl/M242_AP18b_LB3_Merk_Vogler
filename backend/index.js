const http = require('http');
const express = require('express');
const path = require('path');
const { response } = require('express');
const app = express();
const mqtt = require("mqtt");





var client = mqtt.connect("mqtt://cloud.tbz.ch");
client.on("connect",()=>{
    client.subscribe("iotKit_Merk_Vogler/direction", ()=>{
        console.log("server up and running...");
    });
});

var timeData = new Date(Date.now());
var directionData = "None";
var colorData = "white";

client.on("message", (topic, message) => {
    console.log(topic +"   "+ message);
    var data = message.toString().split(";");
    if(data.length == 3){
        console.log(data)
        timeData = data[0];
        directionData = data[2].toLowerCase();
        colorData = data[1];
    }
});

app.use('/localdata', function(req,res){
    res.send({timeData, directionData, colorData});
});

app.use(express.json());
app.use(express.static("express"));
app.use('/test', function(req,res){
    res.sendFile(path.join(__dirname+'/express/index.html'));
});

const server = http.createServer(app);

server.listen(3000, () => {
    console.debug('Server listening on port ' + 3000);
});