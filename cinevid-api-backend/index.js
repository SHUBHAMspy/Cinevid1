//require('dotenv').config()
const config = require('./config/key')
const corsHandling = require('./startup/corsHandling')
const production = require('./startup/prod')
const logger = require('./startup/logger')
const dbConnect = require('./startup/db')
//const config = require('./startup/config')
const routes = require('./startup/routes')
const validation = require('./startup/validation')
const express = require('express');

// App creation and one time connection with mongodb
const app = express();

// Handling cors while connecting with frontend
corsHandling(app)

// Log out errors and handle them
logger()
//throw new Error('Something failed during startup');

// Connect to database
dbConnect()

//Ochestrating or delegating to different routes
routes(app);

// Checking for configuration
//config()
//console.log(process.env.mongoURI);

// Setting up require for validation
validation()

production(app)

//Start listening on server
const port = process.env.PORT || 5000;
const server = app.listen(port,() =>{logger().info(`Listening on port ${port}...`);})


module.exports = server

