// POST /api/returns
const moment = require('moment');
const request = require('supertest');
const mongoose = require('mongoose');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');

// Unhappy Path
// Return 401 if user is unauthenticated i.e not logged in
// Return 400 if customerId is not provided
// Return 400 if movieId is not provided
// Return 404 if no rental is found corresponding to this customerId
// Return 400 if rental is already processed that is returned the movie

// Happy Path
// Return 200 and accept the return(if valid request)
// Set the returned date
// Calculate the rental fee
// Increase the stock for that movieId
// Return the rental summary to the user
//  jest.useRealTimers();

describe('/api/returns',() => {
    
    let server
    let customerId 
    let movieId
    let rental
    let token

    const execute = async () => {
        return await request(server)
            .post('/api/returns')
            .set('auth-token',token)
            .send({customerId,movieId})
            
    }

    beforeEach(async () => { 
        server =  require('../../index')
        customerId = mongoose.Types.ObjectId()
        movieId = mongoose.Types.ObjectId()
        token = new User().generateAuthenticationToken();

        rental = new Rental({
            customer:{
                _id: customerId,
                name:'abcd',
                phone:'1234'
            },
            movie:{
                _id:movieId,
                title:'movie1',
                dailyRentalRate:2,

            }
        })
        await rental.save()

        movie = new Movie({
            _id: movieId,
            title:'movie1',
            genre:{name:'abcd'},
            numberInStock:10,
            dailyRentalRate:2
        })
        await movie.save()
    })

    afterEach(async () => { 
        await server.close()
        await Rental.deleteMany({})
        await Movie.deleteMany({})
    })


    it('should return 401 if user is unauthenticated i.e not logged in',async () =>{
        token = ''

        const res = await execute()
        expect(res.status).toBe(401)
    })

    it('should return 400 if customerId is not provided',async () =>{
        customerId = ''

        const res = await execute()
        expect(res.status).toBe(400)
    })

    it('should return 400 if movieId is not provided',async () =>{
        movieId = ''

        const res = await execute()
        expect(res.status).toBe(400)
    })

    it('should return 404 if no rental is found corresponding to this customerId',async () =>{
        await Rental.deleteMany({})

        const res = await execute()
        expect(res.status).toBe(404)
    })

    it('should return 400 if rental is already processed',async () =>{
        rental.dateReturned = new Date()
        await rental.save()

        const res = await execute()
        expect(res.status).toBe(400)
    })

    it('should return 200 if everything is valid',async () =>{
        //console.log(rental);
        const res = await execute()
        expect(res.status).toBe(200)
    })

    it('should set returnDate if everything is valid',async () =>{
        //console.log(rental);        
        await execute()
        const rentalDocument = await Rental.findById(rental._id)
        console.log(rentalDocument);
        const diff = new Date() - rentalDocument.dateReturned
        expect(diff).toBeLessThan(10 * 1000)
    })

    it('should set the rentalFee if everything is valid',async () =>{
        rental.dateOut = moment().add(-7,'days').toDate()
        await rental.save()

        await execute()
        const rentalDocument = await Rental.findById(rental._id)
        expect(rentalDocument.rentalFee).toBe(7 * rentalDocument.movie.dailyRentalRate)
    })

    it('should increase the numberInStock of a movieId',async () =>{

        await execute()

        const movieDocument = await Movie.findById(movieId)
        expect(movieDocument.numberInStock).toBe(11)
    })

    it('should send the rental summary to the user',async () =>{

        const res = await execute()
        const rentalDocument = await Rental.findById(rental._id)
        expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['customer','movie','dateOut','dateReturned','rentalFee']))
    })


})
