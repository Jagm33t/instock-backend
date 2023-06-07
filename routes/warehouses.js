const router = require("express").Router();
const warehousesController = require("../controllers/warehousesController");

const {
  getWarehouses,
  getWarehouseInventory,
  deleteWarehouse,
  postWarehouse,
  editWarehouse,
} = warehousesController;

require("dotenv").config(); // load variables from .env file
const PORT = process.env.PORT || 8080; // Set server port from .env file
const SERVER_URL = process.env.SERVER_URL;

/*
 * GET home page
 */
router.get("/", getWarehouses);
router.get("/:id/inventories", getWarehouseInventory);
router.delete("/:id", deleteWarehouse);

router.post("/", postWarehouse);

router.put("/:id", editWarehouse);

module.exports = router;
