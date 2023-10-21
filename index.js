const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5001



// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.clvlvsk.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://brandShop:IO6LNXyanqfqJt6F@cluster0.clvlvsk.mongodb.net/?retryWrites=true&w=majority";

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
    // await client.connect();

    const brandCollection = client.db('brandDB').collection('brand')
    const productsCollection = client.db('brandDB').collection('products')
    const usersCollection = client.db('brandDB').collection('user')

    app.get('/brand', async (req, res) => {
      const result = await brandCollection.find().toArray()
      res.send(result)
    })
    app.get('/products', async (req, res) => {
      const result = await productsCollection.find().toArray()
      res.send(result)
    })
    app.get('/products/:brandName', async (req, res) => {
      const brandName = req.params.brandName
      const result = await productsCollection.find({ brandName: brandName }).toArray()
      res.send(result)
    })


    app.get('/products/id/:id', async (req, res) => {
      const id = (req.params.id)
      // if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      //   return res.status(400).send('Invalid ID format');
      // }
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });


    app.post('/products', async (req, res) => {
      const addProduct = req.body
      const result = await productsCollection.insertOne(addProduct)
      res.send(result)
    })
    app.put('/products/id/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const option = { upsert: true }

      const updatedProduct = req.body
      const product = {
        $set: {
          name: updatedProduct.name,
          brandName: updatedProduct.brandName,
          description: updatedProduct.description,
          rating: updatedProduct.rating,
          type: updatedProduct.type,
          price: updatedProduct.price,
          photo: updatedProduct.photo,
        }
      }
      const result = await productsCollection.updateOne(filter, product, option)
      res.send(result);
    })
    app.get('/user', async (req, res) => {
      const result = await usersCollection.find().toArray()
      res.send(result)
    })
    
    app.get('/user/:uid', async (req, res) => {
      const uid = req.params.uid
      const result = await usersCollection.find({ uid: uid }).toArray()
      res.send(result)
    })

    app.post('/user', async (req, res) => {
      const userData = req.body
      const result = await usersCollection.insertOne(userData);
      res.send(result);
    });
    
   
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
      });
      

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

