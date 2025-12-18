const express = require("express");
const app = express();
require("dotenv").config();

const cors = require("cors");
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(require("morgan")("dev"));
app.use(express.json());

app.use("/", require("./trainRouter.js"));

app.listen(PORT, () => {
  console.log("Server started on port 3000");
});
