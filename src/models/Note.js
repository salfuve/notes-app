const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
    idiom_es : { type: String, required: true},
    idiom_en: { type: String, required: true},
    example_en: {type: String, require:false},
    example_es: {type: String, require:false},
    date: {type: Date, default: Date.now},
    user: {type: String}
});

module.exports = mongoose.model('Note', NoteSchema);