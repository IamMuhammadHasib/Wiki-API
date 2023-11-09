// jshint esversion:6

const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")

const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB")

mongoose.connection.on("connected", function () {
    console.log("Connected to MongoDB");
});

mongoose.connection.on("error", function (err) {
    console.error("Error connecting to MongoDB: " + err);
});

mongoose.connection.on("disconnected", function () {
    console.log("Disconnected from MongoDB");
});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

    .get(function (req, res) {
        Article.find({})
            .then((foundArticles) => {
                res.send(foundArticles);
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    })

    .post(function (req, res) {
        // console.log(req.body.title);
        // console.log(req.body.content);

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })

        newArticle.save()
            .then(() => {
                res.send("Successfully added new article");
            })
            .catch((err) => {
                res.send(err)
            });
    })

    .delete(function (req, res) {
        Article.deleteMany({})
            .then(() => {
                res.send("Successfully deleted all articles");
            })
            .catch(() => {
                res.send(err)
            })
    })

app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle })
            .then((foundArticle) => {
                res.send(foundArticle)
            })
            .catch((err) => {
                res.send("No article found on that name")
            })
    })
    .put(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true }
        )
            .then(() => {
                res.send("Successfully updated article")
            })
            .catch((err) => {
                res.send("An error occurred")
            })
    })
    .patch(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body }
        )
            .then(() => {
                res.send("Successfully updated article")
            })
            .catch((err) => {
                res.send("An error occurred")
            })
    })
    .delete(function (req, res) {
        Article.deleteOne({ title: req.params.articleTitle })
            .then(() => {
                res.send("Successfully deleted the article");
            })
            .catch(() => {
                res.send(err)
            })
    })

app.listen(3000, function () {
    console.log("Server started on port 3000")
})