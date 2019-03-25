//DEPENDENCIES
var express = require("express");
var router = express.Router();
var path = require("path");

var request = require("request");
var cheerio = require("cheerio");

//MODELS
var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");

//ROUTES
router.get("/", function(req, res) {
  res.redirect("/articles");
});

//SCRAPE ROUTE
router.get("/scrape", function(req, res) {
  request("https://www.npr.org/sections/world/", function(error, response, html) {
    var $ = cheerio.load(html);
    var titlesArray = [];

    $(".title").each(function(i, element) {
      var result = [];
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      //IF THERE IS A TITLE, SAVE TO DATABASE
      if (result.title !== "" && result.link !== "") {
        //UPDATES
        if (titlesArray.indexOf(result.title) == -1) {
          //SAVE TITLE TO ARRAY
          titlesArray.push(result.title);

          //IF ARTICLE HAS NOT BEEN ADDED, ADD ARTICLE
          Article.count({ title: result.title }, function(err, test) {
            //IF TEST IS EQUAL TO 0, UNIQUE ARTICLE IS TRUE
            if (test == 0) {
              //CREATE NEW OBJECT FROM ARTICLE
              var newEntry = new Article(result);

              //SAVE TO MONGODB
              newEntry.save(function(err, doc) {
                //IF ERROR LOG ERROR, OTHERWISE, CONSOLE LOG DOC.
                if (err) {
                  console.log(err);
                } else {
                  console.log(doc);
                }
              });
            }
          });
        }
        //IF ARTICLE EXISCTS, CONSOLE LOG THIS
        else {
          console.log("Article exists");
        }
        //OTHERWISE, CONSOLE LOG MISSING DATA
      } else {
        console.log("Missing data");
      }
    });
    res.redirect("/");
  });
});

//GET ROUTE FOR ALL ARTICLES
router.get("/articles", function(req, res) {
  //SORTS NEWEST ARTICLES FIRST
  Article.find()
    .sort({ _id: -1 })
    //VIEWS FOR HANDLEBARS
    .exec(function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        var artcl = { article: doc };
        res.render("index", artcl);
      }
    });
});
//GET ROUTE FOR SCRAPED ARTICLES IN DB
router.get("/articles-json", function(req, res) {
  Article.find({}, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.json(doc);
    }
  });
});

//REMOVE ARTICLES
router.get("/clearAll", function(req, res) {
  Article.remove({}, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log("removed all articles");
    }
  });
  res.redirect("/articles-json");
});
router.get("/readArticle/:id", function(req, res) {
  var articleId = req.params.id;
  var handlebarsOb = {
    article: [],
    body: []
  };

  // //FIND ONE ARTICLE BY ID
  Article.findOne({ _id: articleId })
    .populate("comment")
    .exec(function(err, doc) {
      if (err) {
        console.log("Error: " + err);
      } else {
        handlebarsOb.article = doc;
        var link = doc.link;
        //REQUEST ARTICLE FROM LINK
        request(link, function(error, res, html) {
          var $ = cheerio.load(html);

          $(".l-col__main").each(function(i, element) {
            handlebarsOb.body = $(this)
              .children(".c-entry-content")
              .children("p")
              .text();
            //SEND ARTICLES TO VIEW
            res.render("article", handlebarsOb);
            
            return false;
          });
        });
      }
    });
});

//COMMENT POST ROUTE
router.post("/comment/:id", function(req, res) {
  var user = req.body.name;
  var content = req.body.comment;
  var articleId = req.params.id;

  var commentOb = {
    name: user,
    body: content
  };
  var newComment = new Comment(commentOb);
  newComment.save(function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log(doc._id);
      console.log(articleId);
      Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comment: doc._id } },
        { new: true }
      )
        
        .exec(function(err, doc) {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/readArticle/" + articleId);
            console.log(doc);
          }
        });
    }
  });
});
module.exports = router;
