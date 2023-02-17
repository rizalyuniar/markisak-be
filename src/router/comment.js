// Import express and router
const express = require("express");
const router = express.Router();
const commentController = require("../controller/comment");

//Recipe id
router.get('/:id', commentController.getRecipeComments);
router.post('/:id', commentController.createComment);

//Comment id
router.get('/detail/:id', commentController.getDetailComment);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

// Export router to index.js at router folder
module.exports = router;