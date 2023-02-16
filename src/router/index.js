// Import express and router
const express = require("express");
const router = express.Router();

// Import route
const adminRouter = require("./admin");
const recipeRouter = require("./recipe");
const userRouter = require("./user");

// Export router
module.exports = router;
