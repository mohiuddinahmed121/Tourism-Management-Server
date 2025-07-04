const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0lug6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   },
});

async function run() {
   try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();

      const touristSpotCollection = client.db("touristDB").collection("touristSpot");

      app.get("/touristsSpot", async (req, res) => {
         const cursor = touristSpotCollection.find();
         const result = await cursor.toArray();
         res.send(result);
      });

      app.get("/touristsSpot/:id", async (req, res) => {
         const id = req.params.id;
         try {
            const query = { _id: new ObjectId(id) };
            const result = await touristSpotCollection.findOne(query);
            if (!result) {
               return res.status(404).send({ error: "Tourist spot not found" });
            }
            res.send(result);
         } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Server error" });
         }
      });

      app.post("/touristsSpot", async (req, res) => {
         const newTouristSpot = req.body;
         console.log(newTouristSpot);
         const result = await touristSpotCollection.insertOne(newTouristSpot);
         res.send(result);
      });
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
   }
}
run().catch(console.dir);

app.get("/", (req, res) => {
   res.send("SERVER IS RUNNIGNGG");
});

app.listen(port, () => {
   console.log(`server is running: ${port}`);
});
