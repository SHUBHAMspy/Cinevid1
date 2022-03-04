const winston = require('winston')
var logger = require('./logger')()
const config = require('../config/key')
const mongoose = require('mongoose')

module.exports = function () {
    
    const db = config.mongoURI
    console.log(db);
    mongoose.connect(db,{useNewUrlParser: true,useUnifiedTopology: true,})
        .then(()=> logger.info(`Connected to ${db} ...`))
    //useCreateIndex : true
}
