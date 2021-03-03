const multer = require('multer');
const AppError = require('./appError');

const multerStorage = multer.memoryStorage();

const txtFilter = (req, file, cb) => {
  if (file.mimetype === 'text/plain') {
    cb(null, true);
  } else {
    cb(new AppError('Not an .txt file! Please upload only .txt files', 400), false);
  }
};

module.exports = multer({ storage: multerStorage, fileFilter: txtFilter });