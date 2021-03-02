const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Film = require('../models/filmModel');

exports.addNewFilm = catchAsync(async(req, res, next) => {
    const newFilm = await Film.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { film: newFilm }
    })
}) 