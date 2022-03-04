const request = require('supertest');
const {Genre} = require('../../models/genre')
const { User } = require('../../models/user');
const mongoose = require('mongoose');
const { Rental } = require('../../models/rental');

let server;
//coz we are testing the integration of server with request to database via this script
// we need to load any server inorder to test it 
describe('/api/generes',()=>{
    
    beforeEach(() => { server =  require('../../index')})
    afterEach(async () => { 
        await server.close()
        await Rental.deleteMany({})
        
    })

    describe('GET /',() => {
        
        it('should return all genres',async() =>{
            await Genre.collection.insertMany([
                {name: 'genre1'},
                {name: 'genre2'}
            ])
            const res = await request(server).get('/api/genres')
            expect(res.status).toBe(200)
            
            expect(res.body.length).toBe(2)
            expect(res.body.some(g =>g.name == 'genre1')).toBeTruthy()
            expect(res.body.some(g =>g.name == 'genre2')).toBeTruthy()
            

        })
    })

    describe('GET /:id',() => {
        it('should return a genre if valid id is passed',async ()=>{
            const genre = new Genre({name:'genre1'})
            await genre.save()

            const res = await request(server).get('/api/genres/' + genre._id)
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('name',genre.name)
        })

        it('should return 404 if invalid id is passed',async ()=>{

            const res = await request(server).get('/api/genres/1')
            expect(res.status).toBe(404)
        })

        it('should return 404 if the genre with given id do not exist',async ()=>{

            const id = mongoose.Types.ObjectId()
            const res = await request(server).get('/api/genres/' + id)
            expect(res.status).toBe(404)
        })
    })

    describe('POST /',() => {

        let token;
        let name;

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

        it('should return 401 if user is unauthorized i.e not logged in',async() =>{
            token = ''

            const res = await execute()
            expect(res.status).toBe(401)
        })

        it('should return 400 if genre is less than 3 characters',async() => {
            name = 'ge'
            
            const res = await execute()
            expect(res.status).toBe(400)
        })

        it('should return 400 if genre is greater than 50 characters',async() => {
            name = new Array(52).join('s')

            const res = await execute()
            expect(res.status).toBe(400)
        })

        it('should save the genre if it is valid',async() => {
                        
            await execute()

            const genre = await Genre.find({name:'genre1'})
            expect(genre).not.toBeNull()
        })

        it('should return the saved genre if it is valid',async() => {
                        
            const res = await execute()
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name','genre1')
        })
    })

    describe('PUT /:id',() => {

        let token;
        let name;
        let id;

        const execute = async () => {
            return await request(server)
                .put('/api/genres/' + id)
                .set('auth-token',token)
                .send({name:newName})
        }

        beforeEach(async () => {
            token = new User().generateAuthenticationToken();
            genre = new Genre({ name: 'genre1' });
            await genre.save();
            id = genre._id
            newName = 'genre2'
        })

        it('should return 401 if user is unauthorized i.e not logged in',async() =>{
            token = ''

            const res = await execute()
            expect(res.status).toBe(401)
        })

        it('should return 404 if invalid id is passed',async ()=>{

            const res = await request(server).get('/api/genres/1')
            expect(res.status).toBe(404)
        })

        
        it('should return 400 if genre is less than 3 characters',async() => {
            newName = 'ge'
            
            const res = await execute()
            expect(res.status).toBe(400)
        })
        
        it('should return 400 if genre is greater than 50 characters',async() => {
            newName = new Array(52).join('s')
            
            const res = await execute()
            expect(res.status).toBe(400)
        })
        it('should return 404 if the genre with given id do not exist',async ()=>{

            id = mongoose.Types.ObjectId()

            const res = await request(server).get('/api/genres/' + id)
            expect(res.status).toBe(404)
        })
        
        it('should update genre if it is valid',async() => {
            
            await execute()
            
            const genre = await Genre.findById(id)
            expect(genre).not.toBeNull()
        })
        it('should save the updated genre if it is valid',async() => {
            
            await execute()
            
            const genre = await Genre.find({name:'genre2'})
            expect(genre).not.toBeNull()
        })
        
        it('should return the updated genre if it is valid',async() => {
            
            const res = await execute()
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name',newName)
        })
    })

    describe('DELETE /:id',() => {
        let token;
        let name;
        let id;

        const execute = async () => {
            return await request(server)
                .delete('/api/genres/' + id)
                .set('auth-token',token)
                .send()
                
        }

        beforeEach(async () => {
            token = new User({isAdmin:true}).generateAuthenticationToken();

            genre = new Genre({ name: 'genre1' });
            await genre.save();
            id = genre._id
        })

        it('should return 401 if user is unauthorized i.e not logged in',async() =>{
            token = ''

            const res = await execute()
            expect(res.status).toBe(401)
        })

        it('should return 403 if user is not an admin ',async() =>{
            token = new User({isAdmin:false}).generateAuthenticationToken()

            const res = await execute()
            expect(res.status).toBe(403)
        })

        it('should return 404 if invalid id is passed',async ()=>{

            const res = await request(server).get('/api/genres/1')
            expect(res.status).toBe(404)
        })

        it('should delete the genre with given id  ',async ()=>{
            await execute()

            const genreDocument = await Genre.findById(id)
            expect(genreDocument).toBeNull()
        })

        it('should return the deleted genre',async() => {
            
            const res = await execute()
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name','genre1')
        })
    })
})