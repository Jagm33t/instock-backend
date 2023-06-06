const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

const { getHome } = homeController;

require("dotenv").config(); // load variables from .env file
const PORT = process.env.PORT || 8080; // Set server port from .env file
const SERVER_URL = process.env.SERVER_URL;

/*
 * GET home page
 */
router.get("/", getHome);

module.exports = router;
