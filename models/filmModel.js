const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A film must have a title'],
        unique: true,
        trim: true
    },
    releaseYear: {
        type: Number,
        required: [true, 'A film must have release year'],
        validate: {
            validator: function(value) {
                const currentYear = new Date().getFullYear()
                return value > 1900 && value <=currentYear 
            },
            message: 'Year must be between 1900 and current year (included)'
        }
    },
    format: {
        type: String,
        required: [true, 'A film must have a format (VHS, DVD, Blu-Ray)'],
        enum: {
            values: ["VHS", "DVD", "Blu-Ray"],
            message: 'Format must be either VHS, DVD or Blu-Ray'
        }
    },
    stars: {
        type: [String],
        required: [true, 'A film must have stars'],

    },
});

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;