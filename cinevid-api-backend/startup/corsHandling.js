const cors = require('cors')

module.exports = function (app) {
    
    app.use(cors({
        origin:'http://localhost:3000', 
        credentials:true,  //access-control-allow-credentials:true
        methods:['GET','POST','PUT','DELETE'],
        allowedHeaders:['Content-Type','auth-token']         
        //optionSuccessStatus:200
    }));
} 