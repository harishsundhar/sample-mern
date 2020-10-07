const express = require('express');
const mongodb = require('./Config/db');
//const mongoDb = require('./Config/MongoDB');
const app = express();

mongodb();
//Database Mongodb
//mongoDb;

app.use(express.json({
    extended: false
}));


app.get('/', (req, res) => {
    res.send('API RUNNING');
});

app.use('/api/users', require('./route/API/users'));
app.use('/api/auth', require('./route/API/auth'));
app.use('/api/profile', require('./route/API/Profile'));
app.use('/api/posts', require('./route/API/posts'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`PORT RUNNING ${PORT}`)
});




