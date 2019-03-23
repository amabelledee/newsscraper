//DEPENDENCIES
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const cheerio = require('cheerio');
const axios = require('axios');
const logger = require('morgan');
const bodyParser = require('body-parser');

//INITIALIZE EXPRESS
const express = require('express');
var app = express();

//CWD is accessing current working folder
app.use(express.static(process.cwd() + "/public"));
//Require set up handlebars
var exphbs = require("express-handlebars");
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Connect to database
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscraper";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//Routes
// const routes = require("./controller/controller");
// app.use("/",routes);

const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Runnin' Runnin' & Runnin' on " + port);
  });




