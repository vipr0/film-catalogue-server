const express = require('express');
const filmRouter = require('./routes/filmRoute');

const app = express();

app.use('/films', filmRouter)

module.exports = app;