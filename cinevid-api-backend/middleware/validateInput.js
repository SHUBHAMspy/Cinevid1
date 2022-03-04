
module.exports = function (validateRequestObject) {
    return function (req,res,next) {
        let {error} = validateRequestObject(req.body);
        if (error) {
            res.status(400).send(error.details[0].message)
            return
        }
        next()
    }
}