// Import express and router
const express = require("express");
const router = express.Router();

//Import controller functions
const recipeController = require("../controller/recipe.js");
const videoController = require("../controller/video.js");
const commentController = require("../controller/comment.js");
const likedRecipeController = require("../controller/likedRecipe.js");
const savedRecipeController = require("../controller/savedRecipe.js");
const upload = require("../middleware/upload.js");

// Import auth
const authMiddleware = require("../middleware/auth");

//Recipe router
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getDetailRecipe);
router.post('/', authMiddleware.protect, upload.single("photo"), recipeController.createRecipe);
router.put('/:id', authMiddleware.protect, upload.single("photo"), recipeController.updateRecipe);
router.delete('/:id', authMiddleware.protect, recipeController.deleteRecipe);

//Recipe video router
router.get('/:id_recipe/video', videoController.getRecipeVideos);
router.get('/:id_recipe/video/:id_video', videoController.getDetailVideo);
router.post('/:id_recipe/video', authMiddleware.protect, videoController.createVideo);
router.put('/:id_recipe/video/:id_video', authMiddleware.protect, videoController.updateVideo);
router.delete('/:id_recipe/video/:id_video', authMiddleware.protect, videoController.deleteVideo);

//Recipe comment router
router.get('/:id_recipe/comment', commentController.getRecipeComments);
router.get('/:id_recipe/comment/:id_comment', commentController.getDetailComment);
router.post('/:id_recipe/comment', authMiddleware.protect, commentController.createComment);
router.put('/:id_recipe/comment/:id_comment', authMiddleware.protect, commentController.updateComment);
router.delete('/:id_recipe/comment/:id_comment', authMiddleware.protect, commentController.deleteComment);

//Liked recipe router
router.get('/:id_recipe/liked_recipe', likedRecipeController.getLikedRecipe);
router.get('/:id_recipe/liked_recipe/:id_liked_recipe', likedRecipeController.getDetailLikedRecipe);
router.post('/:id_recipe/liked_recipe', authMiddleware.protect, likedRecipeController.createLikedRecipe);
router.delete('/:id_recipe/liked_recipe', authMiddleware.protect, likedRecipeController.deleteLikedRecipe);

// Saved recipe router
router.get('/:id_recipe/saved_recipe', savedRecipeController.getSavedRecipe);
router.get('/:id_recipe/saved_recipe/:id_Saved_recipe', savedRecipeController.getDetailSavedRecipe);
router.post('/:id_recipe/saved_recipe', authMiddleware.protect, savedRecipeController.createSavedRecipe);
router.delete('/:id_recipe/saved_recipe', authMiddleware.protect, savedRecipeController.deleteSavedRecipe);

// Export router to index.js at router folder
module.exports = router;