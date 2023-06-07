const knex = require("knex")(require("../knexfile"));
const express = require("express");
require("dotenv").config(); // load variables from .env file
const PORT = process.env.PORT || 8080; // Set server port from .env file
const SERVER_URL = process.env.SERVER_URL;

// GET functions
function getWarehouses(req, res) {
  knex("warehouses").then((data) => {
    res.status(200).json(data);
  });
}

// Post A New Warehouse
function postWarehouse(req, res) {
  const requiredFields = [
    "warehouse_name",
    "address",
    "city",
    "country",
    "contact_name",
    "contact_position",
    "contact_phone",
    "contact_email",
  ];

  const phoneValidate = /^\+\d{1,3} \(\d{3}\) \d{3}-\d{4}$/;
  const emailValidate = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).send(`Please provide ${field} for the warehouse`);
    }
  }

  if (!phoneValidate.test(req.body.contact_phone)) {
    return res.status(400).send("Please provide a valid phone number");
  }

  if (!emailValidate.test(req.body.contact_email)) {
    return res.status(400).send("Please provide a valid email address");
  }

  knex("warehouses")
    .insert(req.body)
    .then((result) => {
      return knex("warehouses").where({ id: result[0] });
    })
    .then((createdWarehouse) => {
      res.status(201).json(createdWarehouse);
    })
    .catch(() => {
      res.status(500).json({ message: "Unable to create a new warehouse" });
    });
}

function getWarehouseInventory(req, res) {
  const warehouseId = req.params.id;

  knex("warehouses")
    .where({ id: warehouseId })
    .then((warehouse) => {
      if (warehouse.length === 0) {
        return res
          .status(404)
          .json({ message: `Warehouse with ID: ${warehouseId} not found` });
      }
      knex("inventories")
        .where({ warehouse_id: warehouseId })
        .then((inventories) => {
          res.status(200).json(inventories);
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({ message: "Internal server error." });
        });
    })
    .catch(() => {
      res.status(500).json({
        message: `Unable to retrieve data with ID: ${req.params.id}`,
      });
    });
}

function deleteWarehouse(req, res) {
  const warehouseId = req.params.id;

  knex("warehouses")
    .where({ id: warehouseId })
    .del()
    .then((result) => {
      if (result === 0) {
        return res.status(404).json({
          message: `Warehouse with ID: ${warehouseId} not found.`,
        });
      }

      // Delete associated inventory items
      knex("inventories")
        .where({ warehouse_id: warehouseId })
        .del()
        .then(() => {
          res.sendStatus(204); // Successfully deleted
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({ message: "Internal server error." });
        });
    })
    .catch(() => {
      res.status(500).json({
        message: `Unable to delete warehouse with ID: ${warehouseId}`,
      });
    });
}

module.exports = {
  getWarehouses,
  getWarehouseInventory,
  deleteWarehouse,
  postWarehouse,
};
