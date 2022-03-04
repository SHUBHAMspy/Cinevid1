module.exports = function (dynamicThingOrHandler) {
    
    return async (req,res,next) =>{
        // This will be the natural express route handler that will be going in its place
        // So definitely we should return it. So we need a function that returns it as it cannot be return as such on its own
        try {
            // we will be having some dynamic shit here so we need a way or mechanism to pass everytime a dynamic shit at the place
            await dynamicThingOrHandler(req,res)

        } catch (error) {
            next(error);
        }
    }
}