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

function getInventoryItems(req, res) {
  const searchTerm = req.query.s;

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

  query
    .then((data) => {
      // const copyData = [...data];
      // const notShowField = ["address", "city", ""];
      // copyData.forEach((element) => {
      //   for (const field of notShowField) {
      //     delete element[field];
      //   }
      // });
      if (data.length === 0 && searchTerm) {
        res
          .status(404)
          .send(`No match with your search keyword '${searchTerm}'`);
      } else {
        res.status(200).json(data);
      }
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

// Edit an Inventory Item

// function editInventoryItem(req, res) {
//   const requiredFields = [
//     "warehouse_id",
//     "item_name",
//     "description",
//     "category",
//     "status",
//     "quantity",
//   ];

//   for (const field of requiredFields) {
//     if (!req.body[field]) {
//       return res.status(400).send(`Please provide ${field} for the inventory`);
//     }
//   }

//   const quantity = req.body.quantity;

//   if (isNaN(quantity)) {
//     return res.status(400).json({ message: "Quantity must be a number" });
//   }

//   const inventoryId = req.params.id;
//   const warehouseId = req.body.warehouse_id;
//   const updatedData = { ...req.body };
//   delete updatedData.id;

//   const queryState = {
//     foundWarehouse: false,
//     foundInventories: false,
//   };

//   knex("warehouses")
//     .where({ id: warehouseId })
//     .first()
//     .then((warehouse) => {
//       // console.log("warehouse", warehouse);

//       if (!warehouse) {
//         // return res.status(404).json({
//         //   message: `Warehouse with ID: ${warehouseId} not found.`,
//         // });
//         return knex("inventories").where({ id: inventoryId }).first();
//       } else {
//         queryState.foundWarehouse = true;

//         return knex("inventories").where({ id: inventoryId }).first();
//         // .update(updatedData);
//       }
//     })
//     .then((foundInventory) => {
//       // console.log("inventory", foundInventory);

//       if (!foundInventory) {
//         // return res.status(404).json({
//         //   message: `Inventory with ID: ${inventoryId} not found.`,
//         // });
//       } else {
//         // console.log("this line 1 ");
//         queryState.foundInventories = true;

//         return knex("inventories")
//           .where({ id: inventoryId })
//           .first()
//           .update(updatedData);
//       }
//     })
//     .then((me) => {
//       // console.log("this line 2", me);
//       // console.log(updatedItem);
//       // res.json(updatedItem);
//       // // return res.status(200).json(updatedItem);

//       if (!queryState.foundInventories) {
//         res.status(404).json({
//           message: `Inventory with ID: ${inventoryId} not found.`,
//         });
//       } else if (!queryState.foundWarehouse) {
//         res.status(400).json({
//           message: `Warehouse with ID: ${warehouseId} not found.`,
//         });
//       } else {
//         return knex("inventories").where({ id: inventoryId }).first();
//       }
//     })
//     .then((updatedInventory) => {
//       // console.log("this line 3");
//       const updatedData = { ...updatedInventory };
//       delete updatedData.created_at;
//       delete updatedData.updated_at;
//       // delete updatedData.created_at;
//       res.json(updatedData);
//     })
//     .catch(() => {
//       res.status(500).json({
//         message: `Unable to update inventory with ID: ${inventoryId}`,
//       });
//     });
// }
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
      return res.status(400).send(`Please provide ${field} for the inventory`);
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
    .select(
      "inventories.id",
      "inventories.warehouse_id",
      "inventories.item_name",
      "inventories.description",
      "inventories.category",
      "inventories.status",
      "inventories.quantity"
    )
    .where({ id: inventoryId })
    .then((result) => {
      if (result.length === 0) {
        return res
          .status(404)
          .send({ message: `Inventory ID ${inventoryId} not found.` });
      }
      return res.status(200).json(result);
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
