const knex = require("knex")(require("../knexfile"));

// GET functions
// Get all warehouses
function getWarehouses(req, res) {
  const searchTerm = req.query.s;
  const sortBy = req.query.sort_by;
  const orderBy = req.query.order_by || "asc";

  let query = knex("warehouses").select(
    "id",
    "warehouse_name",
    "address",
    "city",
    "country",
    "contact_name",
    "contact_position",
    "contact_phone",
    "contact_email"
  );

  if (searchTerm) {
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    query = query.where((builder) =>
      builder
        .whereRaw("LOWER(warehouse_name) LIKE ?", `%${lowercaseSearchTerm}%`)
        .orWhereRaw("LOWER(address) LIKE ?", `%${lowercaseSearchTerm}%`)
        .orWhereRaw("LOWER(city) LIKE ?", `%${lowercaseSearchTerm}%`)
        .orWhereRaw("LOWER(country) LIKE ?", `%${lowercaseSearchTerm}%`)
        .orWhereRaw("LOWER(contact_name) LIKE ?", `%${lowercaseSearchTerm}%`)
        .orWhereRaw(
          "LOWER(contact_position) LIKE ?",
          `%${lowercaseSearchTerm}%`
        )
        .orWhereRaw("LOWER(contact_phone) LIKE ?", `%${lowercaseSearchTerm}%`)
        .orWhereRaw("LOWER(contact_email) LIKE ?", `%${lowercaseSearchTerm}%`)
    );
  }

  if (sortBy) {
    query = query.orderBy(sortBy, orderBy);
  }

  query
    .then((data) => {
      if (data.length === 0 && searchTerm) {
        res
          .status(404)
          .send(`No match with your search keyword '${searchTerm}'`);
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
      console.log(`getWarehouses: Error retrieving Warehouses ${err}`);
      res.status(400).send(`Error retrieving Warehouses.`);
    });
}

// Get a single warehouse by id
function getSingleWarehouse(req, res) {
  const warehouseId = req.params.id;
  knex("warehouses")
    .select(
      "id",
      "warehouse_name",
      "address",
      "city",
      "country",
      "contact_name",
      "contact_position",
      "contact_phone",
      "contact_email"
    )
    .where({ id: warehouseId })
    .then((result) => {
      if (result.length === 0) {
        return res
          .status(404)
          .send({ message: `Warehouse ID ${warehouseId} not found.` });
      }
      return res.status(200).json(result);
    })
    .catch((err) => {
      // Console.log shows the error only on the server side
      console.log(
        `getSingleWarehouse: Error retrieving data for the Warehouse ID ${warehouseId} ${err}`
      );
      return res
        .status(400)
        .send(`Error retrieving data for the Warehouse ID ${warehouseId}`);
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
      return knex("warehouses").where({ id: result[0] }).first();
    })
    .then((createdWarehouse) => {
      const updatedData = { ...createdWarehouse };
      delete updatedData.created_at;
      delete updatedData.updated_at;
      res.status(201).json(updatedData);
    })
    .catch((err) => {
      // Console.log shows the error only on the server side
      console.log(`postWarehous: Unable to create a new warehouse ${err}`);
      res.status(500).json({ message: "Unable to create a new warehouse" });
    });
}

function getWarehouseInventory(req, res) {
  const warehouseId = req.params.id;
  knex
    .select(
      "inventories.id",
      "inventories.warehouse_id",
      "inventories.item_name",
      "inventories.description",
      "inventories.category",
      "inventories.status",
      "inventories.quantity"
    )
    .from("warehouses")
    .join("inventories", "inventories.warehouse_id", "warehouses.id")
    .where({ warehouse_id: warehouseId })
    .then((warehouse) => {
      if (warehouse.length === 0) {
        return res
          .status(404)
          .json({ message: `Warehouse with ID: ${warehouseId} not  found` });
      }
      res.status(200).json(warehouse);
    })
    .catch((err) => {
      // Console.log shows the error only on the server side
      console.log(
        `getWarehouseInventory: Unable to retrieve data with ID: ${req.params.id} ${err}`
      );
      res.status(500).json({
        message: `Unable to retrieve data with ID: ${req.params.id}`,
      });
    });
}

// PUT Edit Warehouse
function editWarehouse(req, res) {
  const warehouseId = req.params.id;
  const updatedData = { ...req.body };
  delete updatedData.id;

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
    if (!updatedData[field]) {
      return res.status(400).send(`Please provide ${field} for the warehouse`);
    }
  }

  if (!phoneValidate.test(updatedData.contact_phone)) {
    return res.status(400).send("Please provide a valid phone number");
  }

  if (!emailValidate.test(updatedData.contact_email)) {
    return res.status(400).send("Please provide a valid email address");
  }

  knex("warehouses")
    .where({ id: warehouseId })
    .update(updatedData)
    .then((warehouse) => {
      if (warehouse === 0) {
        return res
          .status(404)
          .json({ message: `Warehouse with ID ${warehouseId} not found` });
      }

      return knex("warehouses")
        .select(
          "id",
          "warehouse_name",
          "address",
          "city",
          "country",
          "contact_name",
          "contact_position",
          "contact_phone",
          "contact_email"
        )
        .where({
          id: warehouseId,
        });
    })
    .then((updatedWarehouse) => {
      res.status(200).json(updatedWarehouse[0]);
    })
    .catch((err) => {
      // Console.log shows the error only on the server side
      console.log(
        `editWarehous: Unable to update warehouse with ID: ${warehouseId} ${err}`
      );
      res.status(500).json({
        message: `Unable to update warehouse with ID: ${warehouseId}`,
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
    .catch((err) => {
      // Console.log shows the error only on the server side
      console.log(
        `deleteWarehouse: Unable to delete warehouse with ID: ${warehouseId} ${err}`
      );
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
  editWarehouse,
  getSingleWarehouse,
};
