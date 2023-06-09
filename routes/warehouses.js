const router = require("express").Router();
const warehousesController = require("../controllers/warehousesController");

const {
  getWarehouses,
  getWarehouseInventory,
  deleteWarehouse,
  postWarehouse,
  editWarehouse,
} = warehousesController;

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
