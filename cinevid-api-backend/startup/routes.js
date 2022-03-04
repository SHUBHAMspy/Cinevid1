const error = require('../middleware/error')
const returns = require('../routes/returns')
const auth = require('../routes/auth')
const users = require('../routes/users')
const rentals = require('../routes/rentals')
const movies = require('../routes/movies')
const genres = require('../routes/genres')
const customers = require('../routes/customers')
const express = require('express');


function routes (app) {
    
    app.use(express.json());  
    app.use('/api/genres',genres);
    app.use('/api/customers',customers);
    app.use('/api/movies',movies);
    app.use('/api/rentals',rentals);
    app.use('/api/users',users);
    app.use('/api/auth',auth);
    app.use('/api/returns',returns)
    
    // Error Middleware
    app.use(error)
}

module.exports = routes
