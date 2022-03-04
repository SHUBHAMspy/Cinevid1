const mongoose = require('mongoose');
const request = require('supertest');
const { User } = require('../../models/user');

let server
describe('/api/movies',() => {

    beforeEach(() => { server =  require('../../index')})
    afterEach(async () => { 
        await server.close()
        
    })
    
    describe('POST /',() => {

        let title;
        let genre;
        let numberInStock;
        let dailyRentalRate;
        let genreId
        let token;

        const execute = async () => {
            return await request(server)
                .post('/api/movies')
                .set('auth-token',token)
                .send({
                    title:'movie1',
                    genre:{_id:genreId,name:'abcd'},
                    numberInStock:10,
                    dailyRentalRate:2
                })
        }

        beforeEach(() => {
            token = new User().generateAuthenticationToken();
            genreId = mongoose.Types.ObjectId()
        })

        it('should return 401 if user is unauthorized i.e not logged in',async() =>{
            token = ''

            const res = await execute()
            expect(res.status).toBe(401)
        })

        it('should return 400 if title is less than 3 characters',async() => {
            title = 'ge'
            
            const res = await execute()
            expect(res.status).toBe(400)
        })

        it('should return 400 if title is greater than 50 characters',async() => {
            title = new Array(52).join('s')

            const res = await execute()
            expect(res.status).toBe(400)
        })

        it('should return 400 if numberInStock is -ve',async() => {
            numberInStock = -1

            const res = await execute()
            expect(res.status).toBe(400)
        })

        it('should return 400 if genreId is not provided',async() => {
            genreId = ''

            const res = await execute()
            expect(res.status).toBe(400)
        })

        it('should return 400 if dailyRentalRate is -ve',async() => {
            dailyRentalRate = -1

            const res = await execute()
            expect(res.status).toBe(400)
        })

    })
})