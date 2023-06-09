const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

const { getHome } = homeController;

/*
 * GET home page
 */
router.get("/", getHome);

module.exports = router;
