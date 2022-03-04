const request = require('supertest');
const {User}= require('../../models/user')
const {Genre } = require('../../models/genre')

describe('authorize middleware',() => {
    
    let server;

    beforeEach(() => { server =  require('../../index')})
    afterEach(async () => {
        await server.close() 
        await Genre.deleteMany({})
    })
    
    let token;

    const execute = async () => {
        return await request(server)
            .post('/api/genres')
            .set('auth-token',token)
            .send({name})
    }

    beforeEach(() => {
        token = new User().generateAuthenticationToken();
        name = 'genre1'
    })

    it('should return 401 if no token is provided',async () => {
        token = ''

        const res = await execute()
        expect(res.status).toBe(401)
    })

    it('should return 400 if  token is invalid',async () => {
        token = 'z'

        const res = await execute()
        expect(res.status).toBe(400)
    })

    it('should return the genre if it is valid',async () => {

        const res = await execute()
        expect(res.status).toBe(200)
    })
})