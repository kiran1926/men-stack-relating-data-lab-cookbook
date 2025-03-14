const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const Recipe = require("../models/recipe.js");

// index page 

router.get("/", async(req, res) => {
    res.render("recipes/index.ejs");
});


// get new recipe page form
router.get("/new", (req, res) => {
    res.render("resipes/new.ejs");
});


module.exports = router;