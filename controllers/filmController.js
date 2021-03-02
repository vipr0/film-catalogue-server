const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Film = require('../models/filmModel');

exports.getAllFilms = catchAsync(async(req, res, next) => {
    const allFilms = await Film.find({}).sort('title');

    res.status(200).json({
        status: 'success',
        data: { films: allFilms }
    })
});

exports.getFilm = catchAsync(async(req, res, next) => {
    const film = await Film.findById(req.params.id);

    if(!film) {
        return next(new AppError('There is no film with this ID'))
    }

    res.status(200).json({
        status: 'success',
        data: { film }
    })
});

exports.addNewFilm = catchAsync(async(req, res) => {
    const newFilm = await Film.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { film: newFilm }
    })
});

exports.searchFilm = catchAsync(async(req, res) => {
    const regeexp = new RegExp(req.query.query, 'i');

    const result = await Film.find({ $or: [
        {'title': { $regex: regeexp }},
        {'stars': { $regex: regeexp }}
    ]});

    res.status(200).json({
        status: 'success',
        message: 'Succesfull request',
        result,
    });
})

exports.deleteFilm = catchAsync(async(req, res, next) => {
    const deletedFilm = await Film.findByIdAndDelete(req.params.id);

    if(!deletedFilm) {
        return next(new AppError('No film with this ID'));
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
});
