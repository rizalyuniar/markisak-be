// Import express and router
const express = require("express");
const router = express.Router();

// Import controller functions
const userController = require("../controller/user.js");
const upload = require("../middleware/upload.js");

// Route link to controller
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getDetailUser);
router.post("/register", upload.single("photo"), userController.registerUser);
router.put("/:id", upload.single("photo"), userController.updateUser);
router.delete("/:id", userController.deleteUser);
// router.get("/", userController.getAllUsers);
// router.post('/login', customerController.loginCustomer);
// router.put('/:id', authMiddleware.authToken, authMiddleware.authoCustomer, customerController.updateCustomer);
// router.delete('/:id', authMiddleware.authToken, authMiddleware.authoCustomer, customerController.deleteCustomer);

// Export router to index.js at router folder
module.exports = router;
