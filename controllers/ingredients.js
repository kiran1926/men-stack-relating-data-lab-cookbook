const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const Recipe = require("../models/recipe.js");
const Ingredient = require("../models/ingredient.js");

// list all ingredients
router.get("/", async(req, res) => {
    try {
        const ingredients = await Ingredient.find();
        res.render("ingredients/index.ejs", { ingredients });
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

// add a new ingredient
router.post("/", async(req, res) => {
    try {
        
        const { name } = req.body;
        // create new ingredient
        const newIngredient = new Ingredient ({ name });
        await newIngredient.save();

        res.redirect(`/users/${req.session.user._id}/ingredients`)

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
})


module.exports = router;