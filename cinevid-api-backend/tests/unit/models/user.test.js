const config = require('../../../config/key')
//require('dotenv').config()
const {User} = require('../../../models/user')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')


describe('user.generateAuthenticationToken',() => {
    it('should return a valid JWT', () => {
        const payLoad = {
            _id:new mongoose.Types.ObjectId().toHexString() ,
            isAdmin:true
        }
        const userObject = new User(payLoad)

        const token = userObject.generateAuthenticationToken()
        const decodedPayload = jwt.verify(token,config.privateKEY)
        expect(decodedPayload).toMatchObject(payLoad)
    })
})