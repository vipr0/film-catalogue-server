const express = require('express');
const filmController = require('../controllers/filmController');

const router = express.Router();

router.get('/search', filmController.searchFilm)
router.post('/import', console.log) //Import

router
    .route('/')
    .get(filmController.getAllFilms) // Get all films
    .post(filmController.addNewFilm) // Add new film

router
    .route('/:id')
    .get(filmController.getFilm) // Get film by id
    .delete(filmController.deleteFilm) // Delete film


module.exports = router;