const express = require("express");
require("dotenv").config();
const cors = express();

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port  ${process.env.PORT}`);
});
