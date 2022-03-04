const validateObjectId = require('../middleware/validateObjectId')
const admin = require('../middleware/admin');
const authorize = require('../middleware/authorize')
const asyncMiddleware = require('../middleware/asyncMiddleware');
const validateInput = require('../middleware/validateInput');
const {Movie,validateRequestObject} = require('../models/movie')
const {Genre}= require('../models/genre')
const express = require('express');
const router = express.Router();

router.get('/', async (req,res) =>{
    // Send this request to database
    const movies = await Movie.find();
    res.send(movies);
});

router.get('/:id',validateObjectId, async (req,res) =>{
    // Send this request to database
    const movie = await Movie.findById(req.params.id);
    if (!movie){
        res.status(404).send("The movie with the given ID was not found.");
        return 
    }

    res.send(movie);
});

router.post('/',[authorize,validateInput(validateRequestObject)],async (req,res) =>{
    // This is for client-side data validation
    // Fail Fast/First Approach
    // let {error} = validateRequestObject(req.body);
    // if (error) {
    //     res.status(400).send(error.details[0].message)
    //     return
    // }
    // This is for secondary check/edge case check to ensure that
    // every thing is right
    const genre = await Genre.findById({_id: req.body.genreId})
    if(!genre) {    
        res.status(404).send("The Genre not found")
        return
    }

    const movie = new Movie({           // Normal Objects don't have save() only mongoose objects
        title: req.body.title,          // that are created from mongoose model have them . So,be careful
        genre:{                         // movie.save is not a function error can occur
            _id:req.body.genreId,
            name:genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })
    
    //This is for server-side data i.e data going from server to database.
    const movieDocument = await movie.save() // validation is done by moongoose itself in the backend
    console.log(movieDocument);
    /* try {
        //movie = movieDocument;
        
    } */ /* catch (error) {
        console.log(error.message);
        for(field in error.errors){
            console.log(error.errors[field].message);
        }
    } */

    //Now by conventiona server should return this newly created object on the server to the client
    // to make it aware and better track the resource which has been created.
    res.send(movie);
    
});

router.put('/:id',[authorize,validateInput(validateRequestObject)],async (req,res) => {
    // Then check if the data that is coming for updating is valid or not
    

    const genre = await Genre.findById({_id: req.body.genreId})
    if(!genre) {    
        res.status(404).send("The Genre not found")
        return
    }

    // locate the requested file/object for checking if the object you are looking for updating is present or not
    // If it is not existing then return 404 staus code-not found message
    const movie = await Movie.findByIdAndUpdate({_id:req.params.id},
        { 
            title:req.body.name, // Whenever a data being updated it does not only update the specific property
            genre:{              // rather a whole new image of data is sent for alreading existing data in database
                _id:genre._id,
                name:genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate:req.body.dailyRentalRate
        },{new:true});
    if(!movie) {    
        res.status(404).send("The Genre you requested was not found")
        return
    }

    res.send(movie);
    
});


router.delete('/:id',[authorize,admin],async (req,res) =>{

    const movie = await Movie.findByIdAndRemove(req.params.id)
    // If it is not existing then return 404 staus code-not found message
    if(!movie) {    
        res.status(404).send("The Genre you requested was not found")
        return
    }

    res.send(movie);

});

module.exports = router