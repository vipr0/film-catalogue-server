const express = require('express');
const upload = require('../utils/uploader');
const filmController = require('../controllers/filmController');

const router = express.Router();

router.get('/search', filmController.searchFilm)
router.post('/import', 
    upload.single('file'), 
    filmController.parseFile,
    filmController.insertManyFilms
    ) //Import

router
    .route('/')
    .get(filmController.getAllFilms) // Get all films
    .post(filmController.addNewFilm) // Add new film

router
    .route('/:id')
    .get(filmController.getFilm) // Get film by id
    .delete(filmController.deleteFilm) // Delete film


module.exports = router;