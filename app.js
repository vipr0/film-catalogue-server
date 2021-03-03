const express = require('express');
const compression = require('compression');
const cors = require('cors');

const filmRouter = require('./routes/filmRoute');
const errorController = require('./controllers/errorController');
const bodyParser = require('body-parser');
const AppError = require('./utils/appError');

const app = express();

// Implement CORS
app.use(cors());
app.options('*', cors());

// Body parser, reading data from body into req.body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Compression
app.use(compression());

app.use('/films', filmRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

app.use(errorController)

module.exports = app;