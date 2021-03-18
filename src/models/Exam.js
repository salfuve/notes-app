
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ExamSchema = new Schema({
    definition: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    answer1: { type: String, require: false },
    answer2: { type: String, require: false },
    answer3: { type: String, require: false },
    answer4: { type: String, require: false }
});

module.exports = mongoose.model('Exam', ExamSchema);