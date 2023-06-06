require("dotenv").config(); // load variables from .env file
const PORT = process.env.PORT || 8080; // Set server port from .env file
const SERVER_URL = process.env.SERVER_URL;

// GET functions
function getHome(req, res) {
  const homeHTML = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Instock API Documentation</title>
    <style>
        * {
            font-family: Arial, Helvetica, sans-serif;
        }

        section {
            border-top: solid thin black;
            border-bottom: solid thin black;
        }

        code,
        code span {
            font-family: 'Courier New', Courier, monospace;
        }
    </style>
</head>

<body>
    <h1 id="project-2-brainflix-api">InStock API - Documentation</h1>
    <section>
        <h2 id="overview">Overview</h2>
        <ul>
            <li>The url for the API is <code>${SERVER_URL}:${PORT}</code></li>
        </ul>
    </section>
</body>

</html>
`;
  res.status(200).send(homeHTML);
}

module.exports = {
  getHome,
};
