const router = require("express").Router();
const inventoriesController = require("../controllers/inventoriesController");

const { postInventoryItem, deleteInventoryItem } = inventoriesController;

require("dotenv").config(); // load variables from .env file
const PORT = process.env.PORT || 8080; // Set server port from .env file
const SERVER_URL = process.env.SERVER_URL;

/*
 * POST Inventory Item
 */
router.post("/", postInventoryItem);
router.delete("/:id", deleteInventoryItem);

module.exports = router;
