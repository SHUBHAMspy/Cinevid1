const winston = require('winston')
const logger = require('../startup/logger')()

module.exports = function (err,req,res,next) {
    // Log the error on the server       
    // Logging levels defines or determines the importance of the message that we are going to log
    // 1.error
    // 2.warn
    // 3.info
    // 4.verbose
    // 5.debug
    // 6.silly
    logger.error(err.message,err); 
    
    res.status(500).send('Something went Wrong.')
}