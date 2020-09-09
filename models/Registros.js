const jwt = require("jwt-simple");
const { Schema, model } = require('mongoose');

const registroEsquema = new Schema({
    email:  { type: String, required: true },
    pass:   { type: String, required: true },
    token:  { type: String },
    date:   { type: Date, default: Date.now },
    active: { type: Boolean, default: true }
});

registroEsquema.pre('save', async function (next) {
    const user = this;
    user.token = await jwt.encode(user.email, 'securityToken ');
    next();
});

module.exports = new model('registro', registroEsquema);