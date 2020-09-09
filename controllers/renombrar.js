const Usuarios = require('../models/Usuarios');
const controladorRenombrar = {};

controladorRenombrar.renombrar = async (req, res) => {
    res.json({
        'status': true,
        'message': 'OK'
    });
};

module.exports = controladorRenombrar;
