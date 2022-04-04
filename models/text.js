const mongoose = require('mongoose');

const Scehma = mongoose.Schema;

const textSchema = new Scehma({
    text: {
        type: String
    },
    id: {
        type: Number,
        required: true
    }
})
module.exports = mongoose.model('Text', textSchema);