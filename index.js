require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./src/db/dynamodb");
const cors = require('cors')


const app = express();
const port = process.env.PORT;

app.use(cors()) 
app.use(bodyParser.urlencoded({ extended: true }));

require("./src/routes")(app, db);

app.listen(port, () => {
  console.log("We are live on " + port);
});

