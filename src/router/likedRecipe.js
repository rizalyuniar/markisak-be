// Import express and router
const express = require("express");
const router = express.Router();

//Import controller function
const likedRecipeController = require("../controller/likedRecipe.js");

// Import auth
const authMiddleware = require("../middleware/auth");

//Recipe router
router.get('/user', authMiddleware.protect, likedRecipeController.getUserLikedRecipes);

// Export router to index.js at router folder
module.exports = router;