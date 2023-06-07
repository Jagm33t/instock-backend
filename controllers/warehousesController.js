const express = require("express");
require("dotenv").config(); // load variables from .env file
const PORT = process.env.PORT || 8080; // Set server port from .env file
const SERVER_URL = process.env.SERVER_URL;

const knex = require("knex")(require("../knexfile"));

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

module.exports = {
  getWarehouses,
  postWarehouse,
};
