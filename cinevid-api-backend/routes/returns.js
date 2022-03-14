const Joi = require('joi')
const { Movie } = require('../models/movie')
const { Rental } = require('../models/rental')
const authorize = require('../middleware/authorize')
const validateInput = require('../middleware/validateInput')
const express = require('express')
const router = express.Router()
const moment = require('moment')

// function validate(req,res,next) {
//     let {error} = validateRequestObject(req.body);
//     if (error) {
//         res.status(400).send(error.details[0].message)
//         return
//     }
//     next()
// }


router.post('/',[authorize,validateInput(validateRequestObject)],async(req,res) => {

    // if(!req.body.customerId){
    //     res.status(400).send('customerId is not present')
    //     return
    // }
    
    // if(!req.body.movieId){
    //     res.status(400).send('movieId is not present')
    //     return
    // }
    
    let rental = await Rental.lookup(req.body.customerId,req.body.movieId)
    if(!rental){
        res.status(404).send('rental is not present')
        return
    }

    if(rental.dateReturned){
        res.status(400).send('return already processed')
        return
    }

    rental.return()
    await rental.save()

    const movie = await Movie.findById(rental.movie._id)
    movie.numberInStock = movie.numberInStock + 1
    await movie.save()

    
    // console.log(rental);
    // console.log(rental.toObject());
    rental = rental.toObject();
    rental.dateOut = moment(rental.dateOut).format('DD-MMM-YYYY');
    rental.dateReturned = moment(rental.dateReturned).format('DD-MMM-YYYY');
    res.send(rental);
    
    //res.status(401).send('unauthorized')
    
})

function validateRequestObject(object) {
    const schema=
        Joi.object({
            customerId: Joi.objectId().required(),
            movieId: Joi.objectId().required()
        })
    
        return schema.validate(object)
    
}

module.exports = router
//module.exports = validateRequestObject