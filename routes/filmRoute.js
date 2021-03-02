const express = require('express');
const filmController = require('../controllers/filmController');

const router = express.Router();

router
    .route('/')
    .get(console.log) // Get all films
    .post(filmController.addNewFilm) // Add new film

router
    .route('/:id')
    .get(console.log) // Get film by id
    .patch(console.log) // Edit film
    .delete(console.log) // Delete film

router.post('/import', console.log) //Import

module.exports = router;