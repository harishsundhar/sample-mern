const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://<username:password>@dev-mern.vcy7t.mongodb.net/<mongoCollections>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
 },
 console.log('mongodb connected....')
 );
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
