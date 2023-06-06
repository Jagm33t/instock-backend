const express = require("express");
const cors = require("cors"); // CORS: Cross Origin Resource Sharing
const app = express();
const homeRoutes = require("./routes/home");

require("dotenv").config(); // load variables from .env file
const PORT = process.env.PORT || 8080; // Set server port from .env file
const BIND_ADDRESS = process.env.BIND_ADDRESS || "127.0.0.1"; // Set server address from .env file

/*
 * Middleware
 * CORS: allows sharing data with apps on others servers, cross origin
 * express.json(): allows access to incoming data posted to the server as part of the bady (req.body)
 */
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// home route
app.use("/", homeRoutes);

/*
 * Start the server on an BIND_ADDRESS and PORT number (socket)
 */
const server = app.listen(PORT, BIND_ADDRESS, () => {
  // Get the bind address and port from the socket and log it to the console
  console.log(
    `Server running on ${server.address().address}:${server.address().port}`
  );
});
