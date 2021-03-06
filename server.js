//DEPENDENCIES
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');

//INITIALIZE EXPRESS
const express = require('express');
const app = express();

//CWD is accessing current working folder
app.use(express.static(process.cwd() + "/public"));
//Require set up handlebars
app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Connect to database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to Mongoose!");
});

//Routes
const routes = require("./controller/controller.js");
app.use("/", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Runnin' Runnin' & Runnin' on " + PORT);
});




