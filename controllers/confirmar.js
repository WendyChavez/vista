const Usuarios = require('../models/Usuarios');
const controladorConfirmar = {};

controladorConfirmar.confirmar = async (req, res) => {
    res.json({
        'message': 'HTML'
    });
};

module.exports = controladorConfirmar;
