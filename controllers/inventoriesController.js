const express = require("express");
const knex = require("knex")(require("../knexfile"));
require("dotenv").config(); // load variables from .env file

// GET functions
function getInventoryItems(req, res) {
  const searchTerm = req.query.s;
  const sortBy = req.query.sort_by;
  const orderBy = req.query.order_by || "asc";

  let query = knex("inventories")
    .join("warehouses", "warehouses.id", "inventories.warehouse_id")
    .select(
      "inventories.id",
      "warehouses.warehouse_name",
      "inventories.item_name",
      "inventories.description",
      "inventories.category",
      "inventories.status",
      "inventories.quantity"
    );

  if (searchTerm) {
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    query = query.where((builder) =>
      builder
        .whereRaw("LOWER(warehouse_name) LIKE ?", `%${lowercaseSearchTerm}%`)
        .orWhereRaw("LOWER(item_name) LIKE ?", `%${lowercaseSearchTerm}%`)
        .orWhereRaw("LOWER(description) LIKE ?", `%${lowercaseSearchTerm}%`)
        .orWhereRaw("LOWER(category) LIKE ?", `%${lowercaseSearchTerm}%`)
    );
  }

  if (sortBy) {
    query = query.orderBy(sortBy, orderBy);
  }

  query.then((data) => {
    if (data.length === 0 && searchTerm) {
      res.status(404).send(`No match with your search keyword '${searchTerm}'`);
    } else {
      res.status(200).json(data);
    }
  });
}

// POST functions
// Add a new inventory Item
function postInventoryItem(req, res) {
  // Check if the body has all required fields
  const requiredFields = [
    "warehouse_id",
    "item_name",
    "description",
    "category",
    "status",
    "quantity",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res
        .status(400)
        .json({ message: `Please provide ${field} for the inventory` });
    }
  }

  const quantity = req.body.quantity;

  if (isNaN(quantity)) {
    return res.status(400).json({ message: "Quantity must be a number" });
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
          return res.status(201).json(createdItem);
        })
        .catch(() => {
          return res
            .status(500)
            .json({ message: "Unable to create new Inventory Item" });
        });
    })
    .catch((err) => {
      return res.status(400).send(`Error retrieving Warehouse: ${err}`);
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

// Edit an Inventory Item
function editInventoryItem(req, res) {
  const requiredFields = [
    "warehouse_id",
    "item_name",
    "description",
    "category",
    "status",
    "quantity",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res
        .status(400)
        .json({ message: `Please provide ${field} for the inventory` });
    }
  }

  const quantity = req.body.quantity;

  if (isNaN(quantity)) {
    return res.status(400).json({ message: "Quantity must be a number" });
  }

  const inventoryId = req.params.id;
  const warehouseId = req.body.warehouse_id;
  const updatedData = { ...req.body };
  delete updatedData.id;

  knex("warehouses")
    .where({ id: warehouseId })
    .first()
    .then((warehouse) => {
      if (!warehouse) {
        return Promise.reject({
          status: 400,
          message: `Warehouse with ID: ${warehouseId} not found.`,
        });
      }
      return knex("inventories").where({ id: inventoryId }).first();
    })
    .then((foundInventory) => {
      if (!foundInventory) {
        return Promise.reject({
          status: 404,
          message: `Inventory with ID: ${inventoryId} not found.`,
        });
      }
      return knex("inventories")
        .where({ id: inventoryId })
        .first()
        .update(updatedData);
    })
    .then(() => {
      return knex("inventories").where({ id: inventoryId }).first();
    })
    .then((updatedInventory) => {
      const updatedData = { ...updatedInventory };
      delete updatedData.created_at;
      delete updatedData.updated_at;
      res.json(updatedData);
    })
    .catch((error) => {
      if (error.status) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({
          message: `Unable to update inventory with ID: ${inventoryId}`,
        });
      }
    });
}

// Get a single inventory by id
function getSingleInventory(req, res) {
  const inventoryId = req.params.id;

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
    .where({ "inventories.id": inventoryId })
    .then((result) => {
      if (result.length === 0) {
        return res
          .status(404)
          .send({ message: `Inventory ID ${inventoryId} not found.` });
      }

      return res.status(200).json(result[0]);
    })
    .catch((err) => {
      // Console.log shows the error only on the server side
      console.log(
        `getSingleInventory: Error retrieving data for the Inventory ID ${inventoryId} ${err}`
      );
      return res
        .status(400)
        .send(`Error retrieving data for the Inventory ID ${inventoryId}`);
    });
}

module.exports = {
  postInventoryItem,
  getInventoryItems,
  deleteInventoryItem,
  editInventoryItem,
  getSingleInventory,
};
