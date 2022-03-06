const authorize = require('../middleware/authorize')
const asyncMiddleware = require('../middleware/asyncMiddleware');
const {Customer} = require('../models/customer')
const {Movie} = require('../models/movie')
const {Rental,validateRequestObject} = require('../models/rental')
// const mongoose = require('mongoose');
const Fawn = require('fawn')
const express = require('express');
const router = express.Router();
const config = require('../config/key')

Fawn.init(config.mongoURI);

router.get('/',async (req,res) =>{
    // Send this request to database
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});
router.get('/:id',async (req,res) =>{
    // Send this request to database
    const rentals = await Rental.findOne({'customer._id':req.params.id }).sort('-dateOut');
    console.log(rentals);
    res.send(rentals);
});

router.post('/',authorize,async (req,res) =>{
    // This is for client-side data validation
    // Fail Fast/First Approach
    let {error} = validateRequestObject(req.body);
    if (error) {
        res.status(400).send(error.details[0].message)
        return
    }
    // This is for secondary check/edge case check to ensure that
    // every thing is right
    const customer = await Customer.findById({_id: req.body.customerId})
    if(!customer) {    
        res.status(404).send("The User not found !! Kindly Sign Up")
        return
    }

    const movie = await Movie.findById({_id: req.body.movieId})
    if(!movie) {    
        res.status(404).send("The Movie not found !! Kindly Check for Right Movie")
        return
    }

    if(movie.numberInStock == 0) {
        console.log("Movie not in Stock");
    }

const rental = {
    customer:{
        _id: customer._id,
        name: customer.name,
        isGold: customer.isGold,
        phone: customer.phone
    },

    movie:{
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate
    },
    
    dateOut:Date.now
}; 


// Transactions

// It is well known that MongoDB does not support transactions involving multiple documents. 
// Atomicity in MongoDB is restricted to single document writes and, as a result, 
// if you find yourself in a situation where you need to update multiple documents in “all or nothing” fashion, you’re stuck. 
// For the most part, you can and should model your data in a way that avoids super close ties between documents but there are cases where you need a transaction.

// With Fawn, you can save, update, and delete documents and files across collections in a transactional manner.
// Fawn is a library that implements transactions using this two phase commit system.

// A Transaction is a task(which is considered to be a single unit of work) .
// It’s just an object with an array of steps. 
    

    //This is for server-side data i.e data going from server to database.
    try {
        const task =  Fawn.Task(); // creating a task or Transaction

        task.save('rentals',rental)
            .update('movies',{_id: movie._id},{$inc:{numberInStock: -1}})
            .run()
                
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }

    //Now by conventiona server should return this newly created object on the server to the client
    // to make it aware and better track the resource which has been created.
    res.send(rental);
    
});

module.exports = router;