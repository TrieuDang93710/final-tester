const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const verifyAdmin = require("../middleware/verifyAdmin")
const verifyToken = require("../middleware/verifyToken");

// Get all menu items
router.get("/", menuController.getAllMenuItems);
// post a menu item
router.post("/", verifyAdmin, verifyToken, menuController.postMenuItem);

// delete a menu item
router.delete("/:id", verifyAdmin,verifyToken, menuController.deleteMenuItem);

// get single menu item
router.get("/:id", menuController.singleMenuItem);

// update single menu item
router.patch("/:id", verifyAdmin, verifyToken, menuController.updateMenuItem);

module.exports = router;
