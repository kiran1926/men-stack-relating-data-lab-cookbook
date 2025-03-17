const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/user.js");
const Recipe = require("../models/recipe.js");
const Ingredient = require("../models/ingredient.js"); 

// index page : get all recipes

router.get("/", async(req, res) => {
   try{
    const currentUser = await User.findById(req.session.user._id);
    const recipes = await Recipe.find({ owner: currentUser._id }).populate("ingredients")
    res.render("recipes/index.ejs", { recipes });
   } catch (error) {
    console.log(error);
    res.redirect("/");
   }
});


// get new recipe page form
router.get("/new", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const ingredients = await Ingredient.find();
    res.render("recipes/new.ejs", { ingredients, currentUser });
  } catch (error) {
    console.log("Error fetching ingredients:", error);
    res.redirect("/");
  }
});

// create new recipe
router.post('/', async (req, res) => {
    try {

        console.log("Received form data:", req.body); 
        let { name, instructions, newIngredient = [] } = req.body;

        let ingredients = req.body["ingredients[]"] || []; //  Express does not automatically flatten ingredients[] into ingredients when parsing form data.

       if (!Array.isArray(ingredients)) {
            ingredients = [ingredients]; // Convert single string value to an array 
        }
        console.log("Processed ingredients array:", ingredients);
        
        if (newIngredient) {
            const ingredient = new Ingredient({ name: newIngredient });
            await ingredient.save();
            ingredients.push(ingredient._id.toString()); 
        }

        // Create new recipe with selected ingredients
        const newRecipe = new Recipe({
            name,
            instructions,
            owner: req.session.user._id,
            ingredients: ingredients,
        });

        await newRecipe.save();
        res.redirect(`/users/${req.session.user._id}/recipes`);
    } catch (error) {
      console.error(error);
      res.redirect('/');
    }
  });

// show single recipe
router.get("/:recipeId", async(req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId).populate("ingredients");

        if (!recipe) return res.status(404).send('Recipe not found');

        res.render('recipes/show.ejs', { recipe });
    } catch (error) {
        console.error(error);
        res.redirect('/recipes');
    }
});

// edit recipe form
router.get("/:recipeId/edit", async(req, res) => {
    try {
        const ingredients = await Ingredient.find();
        const recipe = await Recipe.findById(req.params.recipeId).populate("ingredients");

        if (!recipe) return res.status(404).send('Recipe not found');
        
        res.render('recipes/edit.ejs', { recipe, ingredients });
    } catch (error) {
        console.error(error);
        res.redirect('/recipes');
    }
});

// update recipe 
router.put("/:recipeId", async(req, res) => {
    try {
        console.log("Request Body:", req.body);
        
        const ingredientsFound = await Ingredient.find();
        const recipe = await Recipe.findById(req.params.recipeId).populate("ingredients");

        if (!recipe) return res.status(404).send('Recipe not found');

        // Extract ingredients from the request body
        let ingredients = req.body['ingredients[]'] || [];

        console.log("Ingredients from Form:", ingredients);

        // If ingredients is a single value, make it an array
        if (!Array.isArray(ingredients)) {
            ingredients = [ingredients];
        }

        // Filter out any invalid ObjectIds
        ingredients = ingredients.filter(id => mongoose.Types.ObjectId.isValid(id));

        console.log("Valid Ingredients to Save:", ingredients);

        // Update the recipe fields
        recipe.name = req.body.name;
        recipe.instructions = req.body.instructions;

        // Update the ingredients field in the recipe
        recipe.ingredients = ingredients.map(id => new mongoose.Types.ObjectId(id));

        console.log("Mapped Ingredients as ObjectIds:", recipe.ingredients);

        // Save the updated recipe
        await recipe.save();

        res.redirect(`/users/${req.session.user._id}/recipes/${req.params.recipeId}`);
    } catch (error) {
        console.error(error);
        res.redirect('/recipes');
    }
});

// delete recipe 
router.delete("/:recipeId", async(req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId).populate("ingredients");
        console.log(recipe);
        if (!recipe || !recipe.owner.equals(req.session.user._id)) return res.redirect('/recipes');

    await recipe.deleteOne();
    console.log("deleted: ",recipe);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.redirect('/recipes');
  }

});

module.exports = router;