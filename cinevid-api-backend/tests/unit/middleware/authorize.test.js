const mongoose = require("mongoose");
const authorize = require("../../../middleware/authorize");
const { User } = require("../../../models/user")

describe('authorize-middleware',() => {
    it('should save payload of a valid JWT in req.user',() => {
        const user = {
            _id:mongoose.Types.ObjectId(),
            isAdmin: true
        }
        const token = new User(user).generateAuthenticationToken();
        
        const req = {
            header : jest.fn().mockReturnValue(token)
        }

        const res = {}
        const next = jest.fn()

        authorize(req,res,next)

        expect(req.user).toMatchObject(user)
    })
})
