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
router.get("/:id", getWarehouses);
router.get("/:id/inventories", getWarehouseInventory);
router.delete("/:id", deleteWarehouse);
router.put("/:id", editWarehouse);
router.post("/", postWarehouse);

// to search warehouse: http://localhost:8080/api/warehouses?s={xxx}
// to sort warehouse: http://localhost:8080/api/warehouses?sort_by={xxx}&order_by={xxx}

module.exports = router;
