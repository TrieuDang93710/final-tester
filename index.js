const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();


app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(express.json());
app.use(morgan("common"));

mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log("MongoDB connection successful"))
  .catch((err) =>{
    console.log('error: ', err)
    console.log("Connection failed")
  });

// CONECTING DB// APP CONFI
// mongoose
//   .connect(
//     `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.nnyzc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
//     {
//       useNewUrlParser: true,
//     }
//   )
//   .then((res) => console.log("MongoDB connection successful"))
//   .catch((err) => console.log("Connection failed"));

// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(cors());
// app.use(express.json());
// app.use(morgan("common"));

// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.bnadvrv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     await client.connect();
//     // Database and collection
//     const db = client.db("food-server");
//     const menuCollections = db.collection("menus");
//     const cartCollections = db.collection("cartItems");

//     // All menus item operations
//     app.get("/menu", async (req, res, next) => {
//       const rs = await menuCollections.find().toArray();
//       console.log("result: ", rs);
//       return res.send(rs);
//     });
//     // All cart item operations

//     // posting add to cart
//     app.post("/cart", async (req, res, next) => {
//       const cartItem = req.body;
//       const rs = await cartCollections.insertOne(cartItem);
//       res.send(rs);
//     });

//     //getting item to cart
//     app.get("/cart", async (req, res, next) => {
//       const email = req.query.email;
//       const filter = { email: email };
//       const rs = await cartCollections.find(filter).toArray();
//       res.send(rs);
//     });

//     // get specific item to cart
//     app.get("/cart/:id", async (req, res, next) => {
//       const id = req.params.id;
//       const filter = { _id: new ObjectId(id) };
//       const rs = await cartCollections.findOne(filter);
//       res.send(rs);
//     });

//     // delete item to cart
//     app.delete("/cart/:id", async (req, res, next) => {
//       const id = req.params.id;
//       const filter = { _id: new ObjectId(id) };
//       const rs = await cartCollections.deleteOne(filter);
//       res.send(rs);
//     });

//     // update quantity to cart
//     app.put("/cart/:id", async (req, res) => {
//       const id = req.params.id;
//       const { quantity } = req.body;
//       const filter = { _id: new ObjectId(id) };
//       const options = {
//         upsert: true,
//       };
//       const updateDoc = {
//         $set: {
//           quantity: parseInt(quantity, 10),
//         },
//       };
//       const rs = await cartCollections.updateOne(filter, updateDoc, options);
//       res.send(rs);
//     });

//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     // await client.close();
//   }
// }
// run().catch(console.dir);

// // router
// app.use("/v1/category", categoryRouter);

// Listen

/**
 * ====================================================
 */

// jwt authentication
app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1hr",
  });
  res.send({ token });
});

// import router
const menuRouter = require("./api/router/menuRouter");
const cartRouter = require("./api/router/cartRouter");
const userRouter = require("./api/router/userRouter");

app.use("/menu", menuRouter);
app.use("/cart", cartRouter);
app.use("/user", userRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running...${process.env.PORT}`);
});
