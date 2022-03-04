const winston = require('winston')
//require('winston-mongodb')
const {createLogger,transports,format} = require('winston');
require('express-async-errors')

module.exports = function (){

    return winston.createLogger({
        transports:[
            new transports.File({
                filename:'./logs/logfile.log',
                level : 'info',
                format: format.combine(
                    format.timestamp(),
                    format.json(), 
                    format.colorize(),
                    format.metadata({services:'app/use'})  
                )
            }),

            // new transports.MongoDB({
            //         level:'error',
            //         db: "mongodb://localhost:27017/cinevid",
            //         options: {useNewUrlParser: true, useUnifiedTopology: true},
            //         collection:'log',
            //         format: format.combine(format.timestamp(),format.json() )
            // })
        ]
    })
    
    
    // const jsonLogFileFormat = winston.format.combine(
    //     winston.format.errors({ stack: true }),
    //     winston.format.timestamp(),
    //     winston.format.prettyPrint(),
    //     winston.format.colorize(),
    //     winston.format.json()
    // );
    // const logConfiguration = {
    //     'transports': [
        //         new winston.transports.File({
            //             filename: './logs/logfile.log' ,
    //             format: jsonLogFileFormat,
    //             level: "info"
    //         }),
    //         new winston.transports.MongoDB({
    //             db:'mongodb://localhost/cinevid',
    //             level:"Error",
    //             //useNewUrlParser: true,
    
    //         },{useUnifiedTopology: true})
    //     ]
    // };
    
    // return winston.createLogger(logConfiguration)
    
}

const myFormat = format.printf(({ level, message,timestamp }) => {
    return `${timestamp}  ${level}: ${message}`;
});

winston.exceptions.handle(
    new winston.transports.Console({ colorize:true , prettyPrint:true , format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
        myFormat
        
    )}),
    new winston.transports.File({filename:'./logs/uncaughtException.log'})
)

process.on('unhandledRejection',(ex)=>{

    throw ex;
})
// process.on('uncaughtException',(ex) =>{
//     console.log(('WE GOT AN UNCAUGHT EXCEPTION'));
//     winston.error(ex.message,ex);
//     process.exit(1);
// })

// process.on('unhandledRejection',(ex) =>{
//     console.log(('WE GOT AN UNHANDLED REJECTION'));
//     winston.error(ex.message,ex);
//     process.exit(1);
// })
//throw new Error('Something failed during startup');
