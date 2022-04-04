const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    highscore: {
        wpm: {
            type: Number,
            required: false
        },
        cpm: {
            type: Number,
            required: false
        },
        mistakes: {
            type: Number,
            required: false
        },
        words: {
            type: Number,
            required: false
        }
    },
    rank: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model('User', userSchema);