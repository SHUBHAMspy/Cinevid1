const Joi = require('joi')
const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    user:{
        type:new mongoose.Schema({
            email:{
                type:String,
                minlength: 5,
                maxlength: 255,
            },
        }),
        required:true
    },
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
            userId:Joi.objectId().required(),
            name:Joi.string().min(3).required(),
            phone:Joi.string().min(3).required(),
            isGold:Joi.boolean()
        })
    
        return schema.validate(object)
    
}

exports.Customer = Customer;
exports.validateRequestObject = validateRequestObject;
