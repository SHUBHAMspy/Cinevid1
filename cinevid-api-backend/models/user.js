const config = require('../config/key')

const jwt = require('jsonwebtoken')
const Joi = require('joi')
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:50
    },
    email:{
        type:String,
        required:true,
        minlength: 5,
        maxlength: 255,
        unique:true,
        trim:true
    },

    password:{
        type:String,
        required:true,
        minlength: 5,
        maxlength: 1024,
        unique:true,
    },
    isAdmin:Boolean

})

//Information Expert Principle
    //Information expert  is a principle used to determine where to delegate responsibilities such as methods, computed fields, and so on
    // What is a general principle of assigning responsibilities to objects?
    // Assign responsibility to the information expert - the class that has the information necessary to fulfill the responsibility.

userSchema.methods.generateAuthenticationToken = function () {
    const token = jwt.sign({
        _id:this._id,
        name:this.name,
        email:this.email,
        isAdmin:this.isAdmin
    },
    config.privateKEY
    );
    return token
}

const User = mongoose.model('Users',userSchema);

function validateRequestObject(object) {
    const schema=
        Joi.object({
            name:Joi.string().min(3).max(50).required(),
            email: Joi.string().min(5).max(255).email().required(),
            password:Joi.string().min(5).max(50).required(),
        })
    
        return schema.validate(object)
    
}

exports.User = User;
exports.validateRequestObject = validateRequestObject;  