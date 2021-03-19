let mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/PRG6Project');

console.log("Starting: REST API")

//package for web server
const express = require('express')

//make available via app
const app = express()

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extendedparser : true})); 

//add entry for url / 
app.get('/', function(req, res) {
    console.log("End point /")

    res.header("Content-Type", "application/json")
    res.send("{ \"message\": \"Hello World!\" }")
})

//route
let booksRouter = require('./routes/booksRoutes')();
app.use('/api', booksRouter);

//start application
app.listen(8000)

