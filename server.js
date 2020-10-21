const express = require('express');
const mongodb = require('./Config/db');
//const mongoDb = require('./Config/MongoDB');
const app = express();
const path = require('path');

mongodb();
//Database Mongodb
//mongoDb;

// Init middleware
app.use(express.json());


// app.get('/', (req, res) => {
//     res.send('API RUNNING');
// });

//define Routes
app.use('/api/users', require('./route/API/users'));
app.use('/api/auth', require('./route/API/auth'));
app.use('/api/profile', require('./route/API/Profile'));
app.use('/api/posts', require('./route/API/posts'));


//Serve static assests in production
if(process.env.NODE_ENV === 'production') {
    //Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`PORT RUNNING ${PORT}`)
});




