// Import express and router
const express = require("express");
const router = express.Router();

// Import route
const adminRouter = require("./admin");
const recipeRouter = require("./recipe");
const userRouter = require("./user");

// Use route
router.use("/v1/admin", adminRouter);
router.use("/v1/recipe", recipeRouter);
router.use("/v1/user", userRouter);

// Export router
module.exports = router;