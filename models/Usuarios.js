require('../conexion')
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    user:           { type: String, required: true },
    pass:           { type: String, required: true },
    token:          { type: String, default: ''},
    id_counter:     { type: String },
    val_counter:    { type: Number, default: 0 },
    token_counter:  { type: String, required: true },
    name_counter:   { type: String, default: "Contador" },
    id_counter_ext: { type: String, default: '' },
    suscritos:      { type: [] },
    active:         { type: Boolean, default: true }
});

userSchema.pre('save', async function (next) {
    this.id_counter = generarID();
    next();
});

function generarID(){
    const _sym = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let id = '';

    for (var i = 0; i < 16; i++) {
        id += _sym[parseInt(Math.random() * (_sym.length))];
    }
    this.find({"id_counter": id}, function (err, res) {
        if (!res.length) {
            return id;
        } else {
            generarID();
        }
    });
}

module.exports = new model('Usuarios', userSchema);