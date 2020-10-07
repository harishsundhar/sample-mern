const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://harish:rvuLhmVG8V4xJUMf@dev-mern.vcy7t.mongodb.net/test?retryWrites=true&w=majority";
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