const express = require("express");
const knex = require("knex")(require("../knexfile"));
require("dotenv").config(); // load variables from .env file
const PORT = process.env.PORT || 8080; // Set server port from .env file
const SERVER_URL = process.env.SERVER_URL;

// GET functions
function getInventoryItems(req, res) {
  knex("inventories")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).send(`Error retrieving data: ${err}`));
}

// POST functions
function postInventoryItem(req, res) {
  res.status(200).send("POST new inventory Item");
}

module.exports = {
  postInventoryItem,
  getInventoryItems,
};
