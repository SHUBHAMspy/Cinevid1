const Joi = require('joi')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const {User} = require('../models/user')
const express = require('express')
const router = express.Router()

router.post('/',async (req,res) => {
    let {error} = validateRequestObject(req.body);
    if (error) {
        res.status(400).send(error.details[0].message)
        return
    }

    // Check whether  this user is already present or not
    
    
    let user = await User.findOne({email:req.body.email})
    if (!user) {
        res.status(400).send('Invalid email or password')
        return
    }
    

    // Authenticating the user
    const isValidPassword = await bcrypt.compare(req.body.password,user.password)
    if (!isValidPassword) {
        res.status(400).send('Invalid email or password')
    }
    
    // Authentication successful
    const token = user.generateAuthenticationToken()
    res.send(token) // User credentials are right

})

function validateRequestObject(object) {
    const schema=
        Joi.object({
            email: Joi.string().min(5).max(255).email().required(),
            password:Joi.string().min(5).max(50).required(),
        })
    
        return schema.validate(object)
    
}

module.exports = router;
