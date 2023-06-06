const express = require("express");
const router = express.Router();
const warehousesController = require("../controllers/warehousesController");

const { getWarehouses } = warehousesController;

require("dotenv").config(); // load variables from .env file
const PORT = process.env.PORT || 8080; // Set server port from .env file
const SERVER_URL = process.env.SERVER_URL;

/*
 * GET home page
 */
router.get("/", getWarehouses);

module.exports = router;
