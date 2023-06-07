const express = require("express");
const knex = require("knex")(require("../knexfile"));
require("dotenv").config(); // load variables from .env file
const PORT = process.env.PORT || 8080; // Set server port from .env file
const SERVER_URL = process.env.SERVER_URL;
const router = express.Router();

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

function getInventoryItems(req, res) {
  knex("inventories")
    .join("warehouses", "warehouses.id", "inventories.warehouse_id")
    .select(
      "inventories.id",
      "warehouses.warehouse_name",
      "inventories.item_name",
      "inventories.description",
      "inventories.category",
      "inventories.status",
      "inventories.quantity"
    )

    .then((data) => {
      // const copyData = [...data];
      // const notShowField = ["address", "city", ""];
      // copyData.forEach((element) => {
      //   for (const field of notShowField) {
      //     delete element[field];
      //   }
      // });

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
