const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7lbeksz.mongodb.net/test`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function dbConnect() {
  try {
    await client.connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error.name, error.message);
  }
}

dbConnect();
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

const productCollection = client.db("moontech").collection("product");
// get products
app.get("/products", async (req, res) => {
  try {
    let cursor = productCollection.find({});
    const products = await cursor.toArray();

    res.send({
      success: true,
      message: "Successfully get the Data",
      data: products,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// insert products post

app.post("/product", async (req, res) => {
  try {
    const product = req.body;
    console.log(product);

    const result = await productCollection.insertOne(product);

    res.send({
      success: true,
      message: "Data Insert successfully",
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port  ${process.env.PORT}`);
});
