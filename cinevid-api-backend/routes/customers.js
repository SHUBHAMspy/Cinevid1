const asyncMiddleware = require('../middleware/asyncMiddleware');
const admin = require('../middleware/admin');
const authorize = require('../middleware/authorize')
const {Customer,validateRequestObject} = require('../models/customer')
const express = require('express');
const { User } = require('../models/user');
const router = express.Router();

router.get('/', async (req,res) =>{
    // Send this request to database
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.post('/',authorize,async (req,res) => {
    //Before creating a new genre or a new document in the database from the request message body we need to to validate the info or the input in the message body
    //And to validate we need to define a validation schema.
    let {error} = validateRequestObject(req.body);

    if (error) {
        res.status(400).send(error.details[0].message)
        return
    }

    const user = await User.findById({_id: req.body.userId})
    if(!user) {    
        res.status(404).send("The User not found !! Kindly Sign Up")
        return
    }

    let customer = new Customer({
        user:{
            _id:user._id,
            email:user.email
        },
        name:req.body.name,
        isGold:req.body.isGold,
        phone:req.body.phone
    }); 
    
    customer = await customer.save() // validation is done by moongoose itself in the backend
    console.log(customer);
    //console.log(customerDocument);
    /* try {
        //customer = customerDocument;
        
    }  *//* catch (error) {
        console.log(error.message);
        for(field in error.errors){
            console.log(error.errors[field].message);
        }
    } */

    //Now by conventiona server should return this newly created object on the server to the client
    // to make it aware and better track the resource which has been created.
    res.send(customer);

});

router.put('/:id',authorize,async (req,res) => {
    // Then check if the data that is coming for updating is valid or not
    let {error} = validateRequestObject(req.body);
    
    if (error) {
        res.status(400).send(error.details[0].message)
        return
    }
    // locate the requested file/object for checking if the object you are looking for updating is present or not
    // If it is not existing then return 404 staus code-not found message
    const customer = await Customer.findByIdAndUpdate({_id:req.params.id},
        {
            name:req.body.name,
            isGold: req.body.isGold,
            phone:req.body.phone
            
        },{new:true});
    
    if(!customer) {    
        res.status(404).send("The Genre you requested was not found")
        return
    }

    res.send(customer);
    
});

router.delete('/:id',[authorize,admin],async (req,res) =>{

    const customer = await Customer.findByIdAndRemove(req.params.id)
    // If it is not existing then return 404 staus code-not found message
    if(!customer) {    
        res.status(404).send("The Genre you requested was not found")
        return
    }

    res.send(customer);

});

module.exports = router;
