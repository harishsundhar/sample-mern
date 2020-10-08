const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const mongodb = async ()=>{
    try{
       await mongoose.connect(db,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
       });
        console.log('mongodb Connected....')
    }catch(err){
        console.error(err.message);
        //exit process with failure
        process.exit(1);
    }
}


module.exports = mongodb;

