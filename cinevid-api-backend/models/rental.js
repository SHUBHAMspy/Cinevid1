const moment = require('moment')
const Joi = require('joi')
const mongoose = require('mongoose')

const rentalSchema = mongoose.Schema({
    customer:{
        type:new mongoose.Schema({
            name:{
                type:String,
                min:3,
                max:50,
                required:true
            },
            isGold:Boolean,
            phone:{
                type:Number,
                required:true,
            }    
        }),
        required:true
    },
    movie:{
        type:new mongoose.Schema({
            title:{
                type:String,
                minlength:3,
                maxlength:255,
                trim:true,
                required:true
            },
            dailyRentalRate:{
                type:Number,
                min:0,
                required:true
            }
        }),
        required:true
    },
    dateOut:{
        type:Date,
        default:Date.now ,
        required:true
    },
    dateReturned:{
        type:Date,
    },
    rentalFee:{
        type:Number,
        min:0,
        //required:true
    }
})

rentalSchema.statics.lookup = function (customerId,movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    })
}

rentalSchema.methods.return = function () {
    //const date = 
    //moment.locale()
    this.dateReturned = new Date();

    const rentalDays = moment().diff(this.dateOut,'days')
    this.rentalFee = rentalDays * this.movie.dailyRentalRate
}

// rentalSchema.methods.calcRentalFeeUptoNow = function(){
//     const rentalDays = moment().diff(this.dateOut,'days')
//     this.rentalFee =  rentalDays * this.movie.dailyRentalRate
// }

const Rental = mongoose.model('Rentals',rentalSchema);

function validateRequestObject(object) {
    const schema=
        Joi.object({
            customerId: Joi.objectId().required(),
            movieId: Joi.objectId().required()
        })
    
        return schema.validate(object)
    
}

exports.Rental = Rental;
exports.validateRequestObject = validateRequestObject;