const express = require('express');
const filmRouter = require('./routes/filmRoute');
const errorController = require('./controllers/errorController');
const bodyParser = require('body-parser');

const app = express();

// Body parser, reading data from body into req.body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/films', filmRouter);

app.use(errorController)

module.exports = app;