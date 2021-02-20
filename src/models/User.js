const mongoose = require('mongoose');
const {
    Schema
} = mongoose;
const bcrypt = require('bcryptjs');
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});


UserSchema.methods.encryptPassword = async(password) => {
    //esto genera un hash# , aplica el algoritmo de encriptacion 10 veces
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    //devolvemos la password cifrada
    return hash;
}

UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};
module.exports = mongoose.model('User', UserSchema);
