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
// Add a new inventory Item
function postInventoryItem(req, res) {
  // Check if the body has all required fields
  if (
    !req.body.warehouse_id ||
    !req.body.item_name ||
    !req.body.description ||
    !req.body.category ||
    !req.body.status ||
    !typeof req.body.quantity
  ) {
    return res
      .status(400)
      .send(
        "Please provide the following properties for the item in the request: warehouse_id, item_name, description, category, status, quantity"
      );
  }
  if (typeof req.body.quantity !== "number") {
    return res.status(400).send("The quantity property should be a number.");
  }
  // Check if the warehouse_id exists
  knex("warehouses")
    .select("id")
    .where({ id: req.body.warehouse_id })
    .then((warehouseFound) => {
      if (warehouseFound.length === 0) {
        return res.status(400).json({
          message: `Wharehouse with ID: ${req.body.warehouse_id} not found`,
        });
      }
    })
    .catch((err) => res.status(400).send(`Error retrieving Warehouse: ${err}`));

  // Add the new inventory item
  knex("inventories")
    .insert(req.body)
    .then((result) => {
      return knex("inventories")
        .select(
          "id",
          "warehouse_id",
          "item_name",
          "description",
          "category",
          "status",
          "quantity"
        )
        .where({ id: result[0] });
    })
    .then((createdItem) => {
      res.status(201).json(createdItem);
    })
    .catch(() => {
      res.status(500).json({ message: "Unable to create new Inventory Item" });
    });
}

// Delete an Inventory Item
function deleteInventoryItem(req, res) {
  knex("inventories")
    .where({ id: req.params.id })
    .del()
    .then((result) => {
      if (result === 0) {
        return res.status(404).json({
          message: `Inventory with ID: ${req.params.id} to be deleted not found.`,
        });
      }
      res.status(204).send();
    })
    .catch(() => {
      res.status(500).json({ message: "Unable to delete inventory" });
    });
}

module.exports = {
  postInventoryItem,
<<<<<<< HEAD
  getInventoryItems,
=======
  deleteInventoryItem,
>>>>>>> develop
};
