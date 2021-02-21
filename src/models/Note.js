const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
    expresion : { type: String, required: true},
    idiom: { type: String, required: true},
    example: {type: String, require:false},
    date: {type: Date, default: Date.now},
    user: {type: String}
});

module.exports = mongoose.model('Note', NoteSchema);