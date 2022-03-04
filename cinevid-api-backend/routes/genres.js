const validateObjectId = require('../middleware/validateObjectId')
const admin = require('../middleware/admin');
const authorize = require('../middleware/authorize')
const validateInput = require('../middleware/validateInput');
const {Genre,validateRequestObject} = require('../models/genre')
const express = require('express');
const router = express.Router();

router.get('/',async (req,res,) =>{
    // res.setHeader("Access-Control-Allow-Origin", "*")
    // res.setHeader("Access-Control-Allow-Credentials", "true");
    // res.setHeader("Access-Control-Max-Age", "1800");
    // res.setHeader("Access-Control-Allow-Headers", "content-type");
    // res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 

    // Send this request to database
    // This is the dynamic content to be sent or to be executed in the actual route handle governed by express
    // So we want to execute it somewhere but not here so why can't we wrap it in a function which will execute it at that place where it should be executed
    //throw new Error('Could not get the genres');
    const genres = await Genre.find().sort('name');  
    res.send(genres);
});

router.get('/:id',validateObjectId,async (req,res) =>{


    const genre = await Genre.findById(req.params.id)
    // If it is not existing then return 404 staus code-not found message
    if(!genre) {    
        res.status(404).send("The Genre you requested was not found")
        return
    }

    res.send(genre);
})

router.post('/',[authorize,validateInput(validateRequestObject)],async (req,res) => {
    //Before creating a new genre or a new document in the database from the request message body we need to to validate the info or the input in the message body
    //And to validate we need to define a validation schema.
    // let {error} = validateRequestObject(req.body);
    // if (error) {
    //     res.status(400).send(error.details[0].message)
    //     return
    // }

    let genre = new Genre({
        name:req.body.name,
    }); 
    
    const genreDocument = await genre.save() // validation is done by moongoose itself in the backend
    console.log(genreDocument);
    /* try {
        //genre = genreDocument;
        
    } */ /* catch (error) {
        console.log(error.message);
        for(field in error.errors){
            console.log(error.errors[field].message);
        }
    } */

    //Now by conventiona server should return this newly created object on the server to the client
    // to make it aware and better track the resource which has been created.
    res.send(genre);

});

router.put('/:id',[authorize,validateInput(validateRequestObject)],async (req,res) => {
    // Then check if the data that is coming for updating is valid or not
    
    // locate the requested file/object for checking if the object you are looking for updating is present or not
    // If it is not existing then return 404 staus code-not found message
    const genre = await Genre.findByIdAndUpdate({_id:req.params.id},
        {
            name:req.body.name
        },{new:true});
    
    if(!genre) {    
        res.status(404).send("The Genre you requested was not found")
        return
    }

    res.send(genre);
    
});

router.delete('/:id',[authorize,admin],async (req,res) =>{

    const genre = await Genre.findByIdAndRemove(req.params.id)
    // If it is not existing then return 404 staus code-not found message
    if(!genre) {    
        res.status(404).send("The Genre you requested was not found")
        return
    }

    res.send(genre);

});

module.exports = router;