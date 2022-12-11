const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/buzz_development');

const db = mongoose.connection;

db.on('error',console.error.bind(console,'Error connceting to MongoDB'));

db.once('open',function()
{
    console.log('Connected to Database :: MongoDB');
});
module.exports = db;
