const Joi = require('joi')
const mongoose = require('mongoose')
const {genreSchema} = require('../models/genre')

const movieSchema = mongoose.Schema({
    title:{
        type:String,
        minlength:3,
        maxlength:50,
        trim:true,
        
    },
    genre:{                      // We have to include document schema
        type:genreSchema,  // and sub document schema if we are embedding
        required: true
    },
    numberInStock:{
        type:Number,
        min:0,
        required:true
    },
    dailyRentalRate:{
        type:Number,
        min:0,
        required:true
    }
})

const Movie = mongoose.model('Movies',movieSchema)

function validateRequestObject(object) {
    const schema=
        Joi.object({
            title:Joi.string().min(3).max(50),
            genreId: Joi.objectId().required(),
            numberInStock:Joi.number().min(0).required(),
            dailyRentalRate:Joi.number().min(0).required()
        })
    
        return schema.validate(object)
    
}

exports.Movie = Movie;
exports.validateRequestObject = validateRequestObject;  