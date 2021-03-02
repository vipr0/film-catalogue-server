const AppError = require('../utils/appError');

const sendError = (err, req, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;

    return new AppError(message, 400);
};

const handleDuplicateFields = err => {
    const message = `Non unique value in ${Object.keys(err.keyValue).join(', ')} `;

    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;

    return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = {};

    if (err.code === 11000) error = handleDuplicateFields(err);
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);

    error.details = err

    sendError(error, req, res);
};