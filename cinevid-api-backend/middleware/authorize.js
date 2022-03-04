const config = require('../config/key')
const jwt = require('jsonwebtoken')

module.exports = function (req,res,next) {
    const token = req.header('auth-token')
    if (!token) {
        res.status(401).send('Access Denied!! No token provided')
        return
    }
    try {
        const decodedPayload = jwt.verify(token,config.privateKEY)
        req.user = decodedPayload
        
        next()

    } catch (ex) {
        res.status(400).send('Invalid Token.')
    }
    
}