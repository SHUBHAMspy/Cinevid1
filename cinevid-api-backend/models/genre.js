const Joi = require('joi')
const mongoose = require('mongoose')

// Schema declaration for a particular kind of document object (to define its structure)
const genreSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3,
        maxlength:50,
    }
})

// Model creation for generating newer document everytime,just by initializing the properties
const Genre = mongoose.model('Genres',genreSchema);

function validateRequestObject(object) {
    const schema=
        Joi.object({
            name:Joi.string().min(3).max(50).required()
        })
    
        return schema.validate(object)
    
}

exports.Genre = Genre;
exports.validateRequestObject = validateRequestObject;
exports.genreSchema = genreSchema;