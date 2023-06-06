require("dotenv").config(); // load variables from .env file
const PORT = process.env.PORT || 8080; // Set server port from .env file
const SERVER_URL = process.env.SERVER_URL;

// GET functions
function getWarehouses(req, res) {
  res.status(200).send("get working");
}

module.exports = {
  getWarehouses,
};
