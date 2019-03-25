//DEPENDENCIES
var express = require("express");
var router = express.Router();
var axios = require("axios");

//MODELS
var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");

//LIBRARIES
var cheerio = require("cheerio");
var request = require("request");

//HTML ROUTE
router.get("/", function (req, res) {

  Article.find({})
    .populate("comments")
    //EXECUTE QUERY
    .exec(function (error, doc) {
      //IF ERROR, LOG ERROR
      if (error) {
        console.log(error);
      }
      //OTHERWISE, SEND DOC
      else {
        console.log("all article with comments: " + doc);
        res.render("index", { articles: doc });
      }
    });
});

//API ROUTES
router.get("/scrape", function (req, res) {
  //REQUEST FROM NPR
  axios.get("http://www.npr.org/sections/world/", function (error, response, html) {
    var $ = cheerio.load(html);
    //CLASSES AND ELEMENTS PULLED FROM NPR
    $(".item has-image").each(function (i, element) {

      var result = {};
      result.link = $(element).children(".item-info").children(".title").children().attr("href");
      result.title = $(element).children(".item-info").children(".title").children().text();

      Article.findOne({ title: result.title }, function (err, data) {

        if (!data) {
          var entry = new Article(result);

          //SAVE TO DATABASE
          entry.save(function (err, doc) {
            //IF ERROR, LOG ERROR
            if (err) {
              console.log(err);
            }
            //OTHERWISE LOG DOC
            else {
              console.log("Saving " + doc.title);
            }
          });

        }
        else {
          console.log("Aricle " + data.title + " already in database");
        }
      });

    });
    res.redirect("/");
  });
});

router.get("/article/:id", function (req, res) {
  //FIND ARTICLE BY ID
  Article.findOne({ "_id": req.params.id })
    //GET ANY COMMENTS/NOTES
    .populate("comments")
    //EXECUTE
    .exec(function (error, doc) {
      //IF ERROR, LOG ERROR
      if (error) {
        console.log(error);
      }
      //OTHEWISE, RETURN DOC
      else {
        res.json(doc);
      }
    });
});

router.get("/articles", function (req, res) {
  //FIND ALL ARTICLES
  Article.find({}, function (error, doc) {
    //ERRORS
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

// //POST ROUTE FOR COMMENTS
// router.post("/articles/:id", function(req, res) {
//   // Create a new note and pass the req.body to the entry
//   .Note.create(req.body)
//     .then(function(dbNote) {
//       // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//       return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//     })
//     .then(function(dbArticle) {
//       // If we were able to successfully update an Article, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });


module.exports = router;