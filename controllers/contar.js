require('./conectar');
const Usuario = require('../models/Usuarios');
const controladorContar = {};

controladorContar.contar = async (req, res) => {
    console.log(req.body.token, req.body.id_user, req.body.id_counter, req.body.type);
    const id = await Usuario.findOne({ "id_user": req.body.id_user });
    if (id === null) {
        res.json({
            'status': false,
            'message': 'El id no se encuentra registrado'
        });
    }
    const token = await Usuario.find({ "id_user": req.body.id_user, "token_counter": req.body.token });
    if (token.length === 0) {
        res.json({
            'status': false,
            'message': 'Error de autenticacion'
        });
    }
    if (req.body.id_counter === '') {
        const incrementar = await Usuario.update({ 'id_user': req.body.id_user }, { $inc: { 'val_counter': 1 } });
    }
    if (req.body.type === 1) {
        res.json({
            'status': true,
            'message': 'Incrementado correctamente'
        });
    } else if (req.body.type === -1) {
        res.json({
            'status': true,
            'message': 'Decrementado correctamente'
        });
    }
};

controladorContar.display = async (req, res) => {
    
    res.json({
        'status': true,
        'message': '13'
    });
};

module.exports = controladorContar;