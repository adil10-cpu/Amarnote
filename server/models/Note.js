const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    subject: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    teacher: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    extractedText: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String // In case we want to store image url in future
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', noteSchema);
