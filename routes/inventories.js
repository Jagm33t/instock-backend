const router = require("express").Router();
const inventoriesController = require("../controllers/inventoriesController");

const {
  postInventoryItem,
  deleteInventoryItem,
  editInventoryItem,
  getInventoryItems,
  getSingleInventory,
} = inventoriesController;

/*
 * GET Inventory Item
 */
router.get("/", getInventoryItems);
router.get("/:id", getSingleInventory);

// to search inventory: http://localhost:8080/api/inventories?s={xxx}

/*
 * POST Inventory Item
 */
router.post("/", postInventoryItem);
router.delete("/:id", deleteInventoryItem);
router.put("/:id", editInventoryItem);

module.exports = router;
