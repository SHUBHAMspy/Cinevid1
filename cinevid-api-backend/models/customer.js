const Joi = require('joi')
const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3,
        maxlength:50,
    },
    isGold:{
        type:Boolean,
        default: false
    },
    phone:{
        type:String,
        required:true,
        minlength:3,
        maxlength:50,
    },
})

const Customer = mongoose.model('Customers',customerSchema);

function validateRequestObject(object) {
    const schema=
        Joi.object({
            name:Joi.string().min(3).required(),
            phone:Joi.string().min(3).required(),
        })
    
        return schema.validate(object)
    
}

exports.Customer = Customer;
exports.validateRequestObject = validateRequestObject;
