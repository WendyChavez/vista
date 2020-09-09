const jwt = require("jwt-simple");
const { Schema, model } = require('mongoose');


const recuperarSchema = new Schema({
    email:  {type: String, required: true},
    token:  { type: String },
    date:   { type: Date, default: Date.now },
    active: { type: Boolean, default: true }
});

recuperarSchema.pre('save', async function (next) {
    const registro = this;
    registro.token = await jwt.encode(registro.email, 'securityToken ');
    next();
});

module.exports = new model('recuperar', recuperarSchema);