const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const hasDuplicates = require('../utils/hasDuplicates');

const filmSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A film must have a title'],
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
        validate: {
            validator: (value) => value.length > 0,
            message: 'You should have at least one star'
        }
    },
}, { 
    collation: { 
        locale: 'en_US', 
        strength: 1, 
        caseLevel: true, 
        caseFirst: "upper", 
        numericOrdering: true 
    } 
});

filmSchema.pre('save', function (next) {
    if(hasDuplicates(this.stars)) {
        next(new AppError("Stars has duplicates. Check if you don't enter same actor twice.", 400))
    }

    next();
})

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;