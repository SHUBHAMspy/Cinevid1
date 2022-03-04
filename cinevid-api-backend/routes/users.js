const authorize = require('../middleware/authorize')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const asyncMiddleware = require('../middleware/asyncMiddleware')
const {User,validateRequestObject} = require('../models/user')
const express = require('express')
const validateInput = require('../middleware/validateInput')
const router = express.Router()

// authentic user is allowed to access the resourses
// 1. authorize as an admin
// 2. authorize as a regular user
router.get('/me',authorize, async (req,res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user)
})
router.post('/',async (req,res) => {
    let {error} = validateRequestObject(req.body);
    if (error) {
        res.status(400).send(error.details[0].message)
        return
    }

    // Check whether the this user is already present or not
    let user;
    try {
        user = await User.findOne({email:req.body.email})
        if (user) {
            res.status(400).send('User is already registered')
        }
    } catch (error) {
        console.log(error.message);
    }


    user = new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    });
    
    // Hashing Password
    const salt = await bcrypt.genSalt(10);  // This is similar to generating key for hashing with given rounds
    user.password = await bcrypt.hash(user.password,salt)

    try {
        const userDocument = await user.save() // validation is done by moongoose itself in the backend
        console.log(userDocument);
        //customer = customerDocument;
        
    } catch (error) {
        console.log(error.message);
        for(field in error.errors){
            console.log(error.errors[field].message);
        }
    }
    const token = user.generateAuthenticationToken();
    console.log(token);
    res.header('auth-token',token)
       .header('access-control-expose-headers','auth-token')
       .send(_.pick(user,['_id','name','email'])); //Creates an object composed of the picked object properties.
})

router.put('/:id',[authorize,validateInput(validateRequestObject)],async(req,res) => {
    // Hashing Password
    const salt = await bcrypt.genSalt(10);
    const user = await User.findByIdAndUpdate({_id:req.params.id},
        {
            name:req.body.name,
            email:req.body.email,
            password: await bcrypt.hash(req.body.password,salt)
        },{new:true})

        if(!user) {    
            res.status(404).send("The User you requested was not found")
            return
        }

        res.send(user);
})


module.exports = router;
