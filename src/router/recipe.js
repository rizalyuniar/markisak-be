// Import express and router
const express = require("express");
const router = express.Router();
const recipeController = require("../controller/recipe");

router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getDetailRecipe);
router.post('/', recipeController.createRecipe);
router.put('/:id', recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);

// Export router to index.js at router folder
module.exports = router;