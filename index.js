const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");

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

const ProductCollection = client.db("moontech").collection("product");
// get products
app.get("/products", async (req, res) => {
  try {
    let cursor = ProductCollection.find({});
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

app.get("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await ProductCollection.findOne({ _id: new ObjectId(id) });

    res.send({
      success: true,
      message: "Successfully get the Data",
      data: product,
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

    const result = await ProductCollection.insertOne(product);

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

// Delete Product

app.delete("/product/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ProductCollection.findOne({ _id: new ObjectId(id) });

    if (!product?._id) {
      res.send({
        success: false,
        error: "product doesn't exist",
      });
      return;
    }
    const result = await ProductCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount) {
      res.send({
        success: true,
        message: "Successfully deleted the product",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// Update product

app.put("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = req.body;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
      $set: product,
    };
    const result = await ProductCollection.updateOne(
      filter,
      updateDoc,
      options
    );

    console.log(result);

    res.send({
      success: true,
      message: "Successfully Update the Data",
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
