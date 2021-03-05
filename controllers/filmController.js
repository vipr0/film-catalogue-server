const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Film = require('../models/filmModel');

exports.getAllFilms = catchAsync(async (req, res, next) => {
    const allFilms = await Film.find({}).sort('title');

    res.status(200).json({
        status: 'success',
        data: {
            films: allFilms
        }
    })
});

exports.getFilm = catchAsync(async (req, res, next) => {
    const film = await Film.findById(req.params.id);

    if (!film) {
        return next(new AppError('There is no film with this ID'))
    }

    res.status(200).json({
        status: 'success',
        data: {
            film
        }
    })
});

exports.addNewFilm = catchAsync(async (req, res, next) => {
    const newFilm = await Film.create(req.body);
    
    res.status(201).json({
        status: 'success',
        data: {
            film: newFilm
        }
    })
});

exports.searchFilm = catchAsync(async (req, res) => {
    const regeexp = new RegExp(req.query.query, 'i');

    const result = await Film.find({
        $or: [{
                'title': {
                    $regex: regeexp
                }
            },
            {
                'stars': {
                    $regex: regeexp
                }
            }
        ]
    });

    res.status(200).json({
        status: 'success',
        message: 'Succesfull request',
        result,
    });
})

exports.deleteFilm = catchAsync(async (req, res, next) => {
    const deletedFilm = await Film.findByIdAndDelete(req.params.id);

    if (!deletedFilm) {
        return next(new AppError('No film with this ID'));
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
});

exports.parseFile = catchAsync(async (req, res, next) => {
    const fieldsName = {
        "Title": "title",
        "Release Year": "releaseYear",
        "Format": "format",
        "Stars": "stars"
    }
    let filmsArr = []
    const rows = req.file.buffer.toString('utf-8').split("\n\n")

    for(row of rows) {
        filmsArr.push({});
        let fields = row.split('\n');

        for(field of fields) {
            if(field.length > 0) {
                let strHead = field.split(":")[0].trim()
                let strContent = field.split(":")[1].trim()
    
                if (Object.keys(fieldsName).includes(strHead)) {
                    let lastElemIndex = filmsArr.length - 1
                    filmsArr[lastElemIndex][fieldsName[strHead]] = strContent
                }
            }
        }
    }

    filmsArr = filmsArr.map(film => { 
        return { ...film, stars: film.stars.split(',').map(s => s.trim()) }
    })

    req.films = filmsArr

    next()
})

exports.insertManyFilms = catchAsync(async (req, res, next) => {
    Promise
        .all(req.films.map(
            film => Film.create(film).catch(error => ({ error }))
        ))
        .then(results => {
            res.status(200).json({
                status: 'success',
                data: { 
                    fails: results.filter(result => result.error).length,
                    successes: results.filter(result => !result.error).length,
                    results
                }
            })
        });
})