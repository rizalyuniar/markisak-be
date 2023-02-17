// Import express and router
const express = require("express");
const router = express.Router();

//Import controller functions
const recipeController = require("../controller/recipe.js");
const upload = require("../middleware/upload.js");

router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getDetailRecipe);
router.post('/', upload.single("photo"), recipeController.createRecipe);
router.put('/:id', upload.single("photo"), recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);

// Export router to index.js at router folder
module.exports = router;