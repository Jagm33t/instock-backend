const router = require("express").Router();
const inventoriesController = require("../controllers/inventoriesController");

const {
  postInventoryItem,
  deleteInventoryItem,
  editInventoryItem,
  getInventoryItems,
  getSingleInventory,
} = inventoriesController;

require("dotenv").config(); // load variables from .env file
const PORT = process.env.PORT || 8080; // Set server port from .env file
const SERVER_URL = process.env.SERVER_URL;

/*
 * GET Inventory Item
 */
router.get("/", getInventoryItems);
router.get("/:id", getSingleInventory);

/*
 * POST Inventory Item
 */
router.post("/", postInventoryItem);
router.delete("/:id", deleteInventoryItem);
router.put("/:id", editInventoryItem);

module.exports = router;
