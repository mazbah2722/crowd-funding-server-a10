const express = require('express')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fwblr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const campaignCollection = client.db("campaignDB").collection("campaign");

    app.get('/campaign', async(req, res)=>{
      const cursor = campaignCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    
    app.get('/campaign/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const campaign = await Campaign.findById(id); // If using MongoDB
        if (!campaign) {
          return res.status(404).json({ error: "Campaign not found" });
        }
        res.json(campaign);
      } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    
    app.post('/campaign', async(req, res)=>{
      const newAddCampaign = req.body;
      console.log(newAddCampaign);
      const result = await campaignCollection.insertOne(newAddCampaign);
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


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`addCampaign running on port ${port}`)
})