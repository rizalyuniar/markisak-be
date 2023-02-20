// Import express and router
const express = require("express");
const router = express.Router();

// Import controller functions
const userController = require("../controller/user.js");
const upload = require("../middleware/upload.js");

// Import auth
const authMiddleware = require("../middleware/auth");

// Route link to controller
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getDetailUser);
router.post("/register", upload.none(), userController.registerUser);
router.get("/refresh-token", userController.refreshToken);
router.put(
    "/:id",
    authMiddleware.protect,
    authMiddleware.isIdValid,
    upload.single("photo"),
    userController.updateUser
);
router.delete(
    "/:id",
    authMiddleware.protect,
    authMiddleware.isIdValid,
    userController.deleteUser
);
router.get("/verif/:id", userController.verifUser);
router.post("/login", userController.loginUser);

// Export router to index.js at router folder
module.exports = router;
