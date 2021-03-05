const request = require('supertest')
const app = require('../app');
const Film = require('../models/filmModel');
const mongoose = require('mongoose');

mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to DB'))
    .catch(console.error)

const filmDataExample = {
    title: "Blazing Saddles 2",
    releaseYear: 1974,
    format: "VHS",
    stars: ["Mel Brooks", "Clevon Little", "Harvey Korman", "Gene Wilder", "Slim Pickens", "Madeline Kahn"]
}

beforeAll(async () => await Film.deleteMany())

test('Should add new film to DB', async () => {
    const response = await request(app)
        .post('/films')
        .send(filmDataExample)
        .expect(201)

    filmDataExample._id = response.body.data.film._id

    expect(response.body).toMatchObject({
        "status": "success",
        "data": {
            "film": { ...filmDataExample, "__v": 0 }
        }
    })
    
    const newFilm = await Film.findById(filmDataExample._id);
    expect(newFilm).not.toBeNull()
})

test('Should get error if add new film with duplicates in stars array', async () => {
    const response = await request(app)
        .post('/films')
        .send({ ...filmDataExample, stars: ["MEl Brooks", "Mel Brooks ", "mel Brooks"]})
        .expect(400)

    expect(response.body.message).toBe("Stars has duplicates. Check if you don't enter same actor twice.")
})

test('Should get error if add new film without required field (format)', async () => {
    const response = await request(app)
        .post('/films')
        .send({ ...filmDataExample, format: null})
        .expect(500)

    expect(response.body.message).toBe("Film validation failed: format: A film must have a format (VHS, DVD, Blu-Ray)")
})

test('Should get error if add new film with non unique title', async () => {
    const response = await request(app)
        .post('/films')
        .send({ ...filmDataExample, _id: null })
        .expect(400)

    expect(response.body.message).toBe("Non unique value in title ")
})

test('Should get all films', async () => {
    const response = await request(app).get('/films').expect(200)

    expect(response.body).toMatchObject({
        "status": "success",
        "data": {
            "films": [ { ...filmDataExample, "__v": 0 } ]
        }
    })
})

test('Should get film by id', async () => {
    const response = await request(app).get(`/films/${filmDataExample._id}`).expect(200)

    expect(response.body).toMatchObject({
        "status": "success",
        "data": {
            "film": { ...filmDataExample, "__v": 0 }
        }
    })
})

test('Should get error if film id is invaid for getting information', async () => {
    const response = await request(app)
        .get('/films/6040ee205bb9945df88fd033')
        .expect(500)

    expect(response.body.message).toBe("There is no film with this ID")
})

test('Should search film by title', async () => {
    const response = await request(app).get('/films/search?query=Saddles').expect(200)

    expect(response.body).toMatchObject({
        "status": "success",
        "message": "Succesfull request",
        "result": [ { ...filmDataExample, "__v": 0 } ]
    })
})

test('Should search film by star name', async () => {
    const response = await request(app).get('/films/search?query=Brooks').expect(200)

    expect(response.body).toMatchObject({
        "status": "success",
        "message": "Succesfull request",
        "result": [ { ...filmDataExample, "__v": 0 } ]
    })
})

test('Should get empty search result', async () => {
    const response = await request(app).get('/films/search?query=1234').expect(200)

    expect(response.body).toMatchObject({
        "status": "success",
        "message": "Succesfull request",
        "result": []
    })
})

test('Should delete film by id', async () => {
    await request(app).delete(`/films/${filmDataExample._id}`).expect(204)

    const newFilm = await Film.findById(filmDataExample._id);
    expect(newFilm).toBeNull()
})

test('Should get error if film id is invaid for deleting', async () => {
    const response = await request(app)
        .delete('/films/6040ee205bb9945df88fd033')
        .expect(500)

    expect(response.body.message).toBe("No film with this ID")
})

test('Should import films from file', async () => {
    const response = await request(app)
        .post('/films/import')
        .set('Content-Type', 'multipart/form-data')
        .attach("file", `${__dirname}/../sample_movies.txt`)
        .expect(200)

    expect(response.body).toMatchObject({
        "status": "success",
        "data": {
            "fails": 0,
            "successes": 25
        }
    })

    const allFilms = await Film.find({});
    expect(allFilms.length).toBe(25)
})

test('Should get error if importing file is not .txt', async () => {
    const response = await request(app)
        .post('/films/import')
        .set('Content-Type', 'multipart/form-data')
        .attach("file", `${__dirname}/../README.md`)
        .expect(400)

    expect(response.body.message).toBe("Not an .txt file! Please upload only .txt files")
})