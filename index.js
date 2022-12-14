const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

//Root
app.get("/", (req, res) => {
  res.send("Ema John server is running");
});

// MongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.90qadcl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const productCollection = client.db("emaJohnShop").collection("products");
    
    // search product by pages and sizes
    app.get("/products", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      


      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.skip(page*size).limit(size).toArray();
      const count = await productCollection.estimatedDocumentCount();

      res.send({count, products});
    });


    // For local storage
    app.post("/productsByIds", async(req, res) =>{
      const ids = req.body;
      const objectIds = ids.map(id => ObjectId(id));
      const query = {_id : {$in: objectIds}}; // load products by specific id for local storage

      const cursor = productCollection.find(query); // find how many products are there (total products)
      const products = await cursor.toArray();

      res.send(products);
    })


  } 
  finally {

  }
}

run().catch((e) => console.error(e));

// Listen
app.listen(port, () => {
  console.log(`Ema John server is running on port: ${port}`);
});
