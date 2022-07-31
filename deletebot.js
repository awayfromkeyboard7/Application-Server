// const mongoose = require('mongoose');
const db = require('./lib/db');
const User = require("./models/db/user");
db.connect();

User.deleteMany({'token':'stresstestbot'}).then(function() {
    console.log('all stressbot are deleted!');
    process.exit(0);
}).catch(function(err) {
    console.log(err);
});