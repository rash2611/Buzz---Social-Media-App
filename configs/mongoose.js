const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/buzz_development');

const db = mongoose.connection;

db.on('error',console.error.bind(console,'Error connceting to MongoDB'));

db.once('open',function()
{
    console.log('Connected to Database :: MongoDB');
});
module.exports = db;
